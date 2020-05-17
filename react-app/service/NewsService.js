import config from '../utility/config';
import Database from './DatabaseService';
import querystring from 'querystring';
import axios from 'axios';

var currentHeadlines = [];
var otherNews = {
    International: [],
    Business: [],
    Sports: [],
    Technology: []
}

const NewsService = {
    syncTime: null,
    fetchNews() {
        return new Promise(function(resolve, reject) {
            let that = this;
            let newsTopics = [null, 'international', 'sports', 'business', 'technology'];
            let rejected = false;
            let currTime = new Date();
            if (that.syncTime) {
                if (((currTime/1000) - that.syncTime) < (config.syncing.newsSync*60)) {
                    //Do not sync before this time.
                    return resolve();
                }
            } else {
                that.syncTime = currTime/1000;
            }
            //Fetch each topic
            for (let i=0; i<newsTopics.length ; i++) {
                that.callNewsReachServer(newsTopics[i]).then(function({news}) {
                    let _this = that;
                    if (!newsTopics[i]) {
                        newsTopics[i] = "Headlines";
                    }
                    _this.insertNews(news, newsTopics[i]);
                }.bind(that)).catch(e => {
                    console.log('Error while fetching content ', e);
                    rejected = true;
                    return reject(e);
                });
            }
            if (!rejected) {
                // DataSyncService.downloadImageForNews();
                resolve();
            }
        }.bind(this));
    },
    callNewsReachServer: function(topic) {
        let QueryString;
        let url = config.routes.NEWSREACH() +'?authnr=ed5x7as_8dw4asadas8rdRawdda4soJsl3dk23!R';
        topic = topic || null;

        if (topic) {
            // QueryString = querystring.stringify({
            //     authnr: 'ed5x7as_8dw4asadas8rdRawdda4soJsl3dk23!R', //gave the values directly for testing,
            //     category: topic
            // });
            url = url+'&category='+topic
        }

        return new Promise(function(resolve, reject) {
            //Fetch Headlines First
            axios.post(url, {
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 10000
            }).then(function(response) {
                console.log(response);
                resolve({news: response.data.posts, topic: topic});
            }).catch(e => {
                console.log('Unable to reach the server for news');
                reject(e);
            });
        }.bind(this));
    },
    insertNews: function(newsArray, topic) {
        topic = topic.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

        return new Promise(function(resolve, reject) {
            newsArray.map(async function (news) {
                let dataToSave = [];
                let date;
                let createdAt = new Date();
                createdAt.setHours(8,0,0,0);
                createdAt = createdAt/1000;
    
                let expiry = createdAt +(48*60*60);
    
                if (isNaN(parseInt(news.time))) {
                    //Date to Epoch Time
                    date = new Date(news.time);
                    date.setHours(0,0,0,0);
                    date = date/1000;
                } else {
                    //It is epoch time.
                    date = news.time;
                }
    
                dataToSave.push(news.contentUrl);
                dataToSave.push(0);
                dataToSave.push(0);
                dataToSave.push(news.title);
                dataToSave.push(news.coverImg);
                dataToSave.push(news.contentHtml);
                dataToSave.push(news.keyword);
                dataToSave.push(topic);
                dataToSave.push("News Reach");
                dataToSave.push(news.partnerLogo);
                dataToSave.push(date);
                dataToSave.push(createdAt);
                dataToSave.push(expiry);
                
                let sql = `INSERT OR IGNORE INTO news (contentUrl, sentFlag, mainScreenFlag, contentTitle, coverImg, contentHtml, keywords, category, partner, partnerLogo, time, createdAt, expiry)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                await Database.run(sql, dataToSave);
            });

            resolve();
        });
    },
    getNews: function() {
        return new Promise(async function (resolve, reject) {
            await Database.run('UPDATE news SET sentFlag=0 WHERE sentFlag=1');
            let expiry = (new Date().getTime()/1000);
            var initquery = "SELECT * FROM news WHERE expiry > "+expiry;

            let queries = [
                " AND category='Headlines' order by RANDOM() LIMIT 10 ",
                " AND category='International' order by RANDOM() LIMIT 3 ",
                " AND category='Business' order by RANDOM() LIMIT 3 ",
                " AND category='Sports' order by RANDOM() LIMIT 3 ",
                " AND category='Technology' order by RANDOM() LIMIT 3 ",
            ];

            let rowsToReturn = [];
            async function runQuery(query) {
                return new Promise(function (resolve, reject) {
                    Database.run(initquery + query).then(result => {
                        
                        if (!(result.rows.length > 0)) {
                            let columnsToUpdate = [];
                            let rowsToReturn = [];

                            for(let i=0; i<result.rows.length; i++) {
                                columnsToUpdate.push(result.rows.item(i).id);
                                rowsToReturn.push(result.rows.item(i));
                            }

                            if (columnsToUpdate.length > 0) {
                                let colms = columnsToUpdate.join(',');
                                columnsToUpdateQuery = "UPDATE news SET sentFlag=1 WHERE id in (" + colms + ")";
                                Database.run(columnsToUpdateQuery);
                            }
                            resolve(rowsToReturn);
                        }
                        
                        let columnsToUpdate = [];
                        let rowsToReturn = [];

                        for(let i=0; i<result.rows.length; i++) {
                            columnsToUpdate.push(result.rows.item(i).id);
                            rowsToReturn.push(result.rows.item(i));
                        }

                        if (columnsToUpdate.length > 0) {
                            let colms = columnsToUpdate.join(',');
                            columnsToUpdateQuery = "UPDATE news SET sentFlag=1 WHERE id in (" + colms + ")";
                            Database.run(columnsToUpdateQuery);
                        }
                        resolve(rowsToReturn);
                    });
                }.bind(query));
            }

            for (let i=0; i < queries.length; i++) {
                let something = await runQuery(queries[i]);
                rowsToReturn = rowsToReturn.concat(something);
            }

            let headlines = [];
            let international = [];
            let business = [];
            let sports = [];
            let technology = [];

            rowsToReturn.sort(function(a, b){
                return a.id-b.id
            });

            rowsToReturn.map(news => {
                switch (news.category) {
                    case "International":
                        international.push(news);
                        break;
                    case "Headlines":
                        headlines.push(news);
                        break;
                    case "Sports":
                        sports.push(news);
                        break;
                    case "Business":
                        business.push(news);
                        break;
                    case "Technology":
                        technology.push(news);
                        break;
                }
            });

            let otherNews = {
                International: international,
                Business: business,
                Sports: sports,
                Technology: technology
            }

            this.setHeadlines(headlines);
            this.setOtherNews(otherNews);

            resolve();
        }.bind(this));
    },
    deleteExpiredContents: function() {
        return new Promise(function (resolve, reject) {
            let expiry = parseInt((new Date().getTime())/1000);
            let sql = `DELETE FROM news WHERE expiry < `+expiry;
            Database.run(sql).then(() => {
                resolve();
            }).catch(() => {
                console.log('ERROR!!! Cannot Delete EXPIRED NEWS CONTENTS');
                reject();
            })
        });
    },
    getNewsForTiles: function(sizes) {
        return new Promise(async function(resolve, reject) {
            await Database.run('UPDATE news SET mainScreenFlag=0 WHERE mainScreenFlag=1');
            //Expiry of the news content
            let newsExpiry = (new Date().getTime()/1000);

            //Calculate the limit of the SELECT query
            let limit = 0;
            for (let size in sizes) {
                limit += sizes[size];
            }

            let newsSQL = ` SELECT
                                id, contentUrl, contentTitle, coverImg, contentHtml, keywords, category, partner, partnerLogo
                            FROM news WHERE
                                expiry > `+newsExpiry+` order by RANDOM() LIMIT `+limit;
            
            Database.run(newsSQL).then(results => {
                if (!(results.rows.length > 0)) {
                    return reject();
                }

                let columnsToUpdate = [];
                let NewsToReturn = [];
                let keyCount = 0;
                for(let i=0 ; i<results.rows.length ; i++) {
                    let thisNews = results.rows.item(i);
                    columnsToUpdate.push(thisNews.id);

                    let key = Object.keys(sizes)[keyCount];
                    let keyToUpper = key.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                        return letter.toUpperCase();
                    });

                    if (sizes[key] > 0) {
                        thisNews['img'+keyToUpper] = thisNews.coverImg;
                        if ('coverImg' in thisNews) {
                            delete thisNews.coverImg;
                        }
                        sizes[key] = sizes[key]-1;
                        if (sizes[key] <=0 ) {
                            keyCount ++;
                        }
                    }
                    thisNews.type = "news";
                    NewsToReturn.push(thisNews);
                }

                if (columnsToUpdate.length > 0) {
                    let colms = columnsToUpdate.join(',');
                    columnsToUpdateQuery = "UPDATE news SET mainScreenFlag=1 WHERE id in (" + colms + ")";
                    
                    Database.run(columnsToUpdateQuery).then(updatedResults => {
                        resolve(NewsToReturn);
                    }).catch(e => {
                        console.log('ERROR!! While updating the news for tiles',e);
                        return reject();
                    });
                } else {
                    console.log('Should never reach here. As we already know that there are rows to return');
                    return reject();
                }
            });
        }.bind(this));
    },
    getHeadlines: function() {
        return currentHeadlines;
    },
    setHeadlines: function(news) {
        currentHeadlines = news;
    },
    setOtherNews: function(news) {
        for (let[key,value] of Object.entries(news)) {
            if(value.length === 0) {
                delete news[key];
            }
        }
        otherNews = news;
    },
    getOtherNews: function(news) {
        return otherNews;
    }
}

export default NewsService;
