import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Database from './DatabaseService';
import axios from 'axios';
import config from '../utility/config';

const VideoService = {
    xplayChannels: [],
    channelVideos: [],
    getChannels: function() {
        return this.xplayChannels;
    },
    getVideos: function() {
        return this.channelVideos;
    },
    syncContents: function() {
        return new Promise(function (resolve, reject) {
            this.syncChannels().then(async function(contents) {
                console.log('Video Contetns....', contents);
                
                await Database.run("DELETE from video_channels");
                await Database.run("DELETE from videos");
                await Database.run("DELETE from video_assets");

                contents.map(channel => {
                    let createdAt = new Date();
                    createdAt.setHours(8,0,0,0);
                    createdAt = createdAt/1000;
    
                    let dataToInsert = [];
                    dataToInsert.push(channel.id);
                    dataToInsert.push(channel.name);
                    dataToInsert.push(channel.desc);
                    dataToInsert.push(channel.photo);
                    dataToInsert.push(channel.cover_photo);
                    dataToInsert.push(createdAt);
                    dataToInsert.push(0);

                    let channelSql = `INSERT OR IGNORE INTO video_channels (channelId, channelName, channelDesc, channelIcon, channelCover, createdAt, markDeleted) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                    Database.run(channelSql, dataToInsert).then(channelResults => {
                        let channelId = channelResults.insertId;

                        channel.videos.map(async function (video) {
                            let videoToInsert = [];

                            videoToInsert.push(0);
                            videoToInsert.push(video.id);
                            videoToInsert.push(channelId);
                            videoToInsert.push(video.title);
                            videoToInsert.push(video.desc);
                            videoToInsert.push(video.keywords);
                            videoToInsert.push(video.asset_id); //Video URL
                            videoToInsert.push(0);
                            videoToInsert.push(video.thumbnail);
                            videoToInsert.push(video.big);
                            videoToInsert.push(video.mid);
                            videoToInsert.push(createdAt);
                            videoToInsert.push(0);

                            let videoSql = 'INSERT OR IGNORE INTO videos ';
                            videoSql += '(mainScreenFlag, videoId, channelId, videoTitle, videoDesc, keywords, videoURL, total_duration, '; //Change Video URL to Asset ID
                            videoSql += 'videoThumbnail, videoImageBig, videoImageMid, createdAt, markDeleted) ';
                            videoSql += `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                            Database.run(videoSql, videoToInsert).then(async function (videoResults) {
                                try {
                                    let videoAssetQuery = 'INSERT OR IGNORE INTO video_assets ';
                                    videoAssetQuery += '(asset_id, remote_url, local_url, is_main, duration, sequence_number, mime_type, ';
                                    videoAssetQuery += 'size, impressions, createdAt, expiry) VALUES (? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? )';
                                    
                                    let videoAssetToInsert = [];

                                    videoAssetToInsert.push(video.asset_id) // asset id
                                    videoAssetToInsert.push(video.remote_url) // remote url
                                    videoAssetToInsert.push(video.video) // local url
                                    videoAssetToInsert.push(1) // is_main
                                    videoAssetToInsert.push(0) // duration
                                    videoAssetToInsert.push(1) // sequence_number
                                    videoAssetToInsert.push('') // mime_type
                                    let stats = await RNFetchBlob.fs.stat(video.video);
                                    videoAssetToInsert.push(stats.size) // size
                                    videoAssetToInsert.push(0) // impressions
                                    videoAssetToInsert.push(Math.floor(new Date()/1000)) // created_at
                                    videoAssetToInsert.push(89999999999) // expiry
                                    Database.run( videoAssetQuery, videoAssetToInsert).then(async function (videoAssets) {}).catch(e => console.log(e))
                                } catch (e) {
                                    console.log(e)
                                   // return reject()
                                }
                            });
                        });
                    }).catch(e => {
                        console.error('SQL', channelSql, 'might cause problem "Possible Unhandled Promise Rejection" and "Attempt to get length of null array"', e);
                        //return reject()
                    })
                });
                resolve();
            }).catch((e) => {
                console.error('ERROR!! While fetching video contents', e);
                return reject();
            });
        }.bind(this));
    },
    getAssetIdAndRemoteUrl: function( id) {
        return new Promise( function( resolve, reject) {
            let findAssetIdUrl = config.routes.dataSync.findAssetId(id);
            axios({
                method: 'get',
                url: findAssetIdUrl,
                timeout: 10000
            }).then(response => {
                resolve(response.data)
            }).catch(e => {
                console.log('Get asset id failed',e)
                return reject()
            })
        })
    },
    syncChannels: function() {
        return new Promise(function(resolve, reject) {
            let _this = this;
            let channelToResolve = [];
            RNFS.readDir("/storage/emulated/0/Xwards/Videos").then(async function (channels) {
                for (let i=0; i<channels.length; i++) {
                    let path = channels[i].path;
                    let folderName = path.substr(path.lastIndexOf('/')+1);
                    if (channels[i].isFile()) {
                        continue;
                    }
                    try {
                        let channelDetail = await _this.syncChannelDetails(path, folderName);
                        channelToResolve.push(channelDetail);
                    } catch(e) {
                        console.log('Error for ', path);
                    }
                }
                resolve(channelToResolve);
            }.bind(_this)).catch(e => {
                console.warn('Unable to read local storage might cause problem "Possible Unhandled Promise Rejection" and "Attempt to get length of null array"', e);
                return reject();
            })
        }.bind(this));
    },
    syncChannelDetails: function(dir, folderName) {
        return new Promise(async function(resolve, reject) {
            let channelDetails = {};
            if (await RNFS.exists("file://" + dir + '/channel.json')) {
                let channelJson = "file://" + dir + '/channel.json';
                channelJson = await RNFS.readFile("file://" + dir + '/channel.json');
                try {
                    channelJson = JSON.parse(channelJson);
                    if (!('id' in channelJson)) {
                        return reject();
                    }
                    if (!('name' in channelJson)) {
                        return reject();
                    }

                    if (channelJson.id !== folderName) {
                        //Rename the channel folder with ChannelID
                        await RNFS.moveFile("file://" + dir, "file://" + dir.substr(0,dir.lastIndexOf('/')+1) + channelJson.id);
                        dir = dir.substr(0,dir.lastIndexOf('/')+1) + channelJson.id;
                    }

                    channelDetails.id = channelJson.id;
                    channelDetails.name = channelJson.name.replace(/\"/g,'\\"');
                    if ('description' in channelJson) {
                        channelDetails.desc = channelJson.description.replace(/\"/g,'\\"');
                    }
                } catch (e) {
                    return reject();
                }

                if (await RNFS.exists("file://" + dir + '/cover_photo.jpg')) {
                    channelDetails.cover_photo = "file://" + dir + '/cover_photo.jpg';
                } else {
                    return reject();
                }
                if (await RNFS.exists("file://" + dir + '/photo.jpg')) {
                    channelDetails.photo = "file://" + dir + '/photo.jpg';
                } else {
                    return reject();
                }

            } else {
                return reject();
            }
            
            channelDetails.videos = [];
            
            let videos = await RNFS.readDir(dir);

            for (let i=0;i<videos.length;i++) {
                if (videos[i].isFile()) {
                    continue;
                }

                try {
                    let path = videos[i].path;
                    let folderName = path.substr(path.lastIndexOf('/')+1);
                    let videoDetails = await this.syncChannelVideos(videos[i].path, folderName);
                    channelDetails.videos.push(videoDetails);
                } catch (e) {
                    console.warn('Missing File',e)
                }
            }

            resolve(channelDetails);
        }.bind(this));
    },
    syncChannelVideos: function(dir, folderName) {
        return new Promise (async function (resolve, reject) {
            let video = {};

            if (await RNFS.exists("file://" + dir + '/video.json')) {
                let videoJson = "file://" + dir + '/video.json';
                videoJson = await RNFS.readFile("file://" + dir + '/video.json');
                var flagToDelete = false; //TODO: REMOVE IN FUTURE
                try {
                    videoJson = JSON.parse(videoJson);
                    
                    if (!('neo_id' in videoJson)) {
                        return reject('Missing NEO_ID in videoJSON',dir);
                    }
                    if (!('keywords' in videoJson)) {
                        return reject('Missing keywords in videoJSON',dir);
                    }
                    
                    if (!('title' in videoJson)) {
                        return reject('Missing title in videoJSON',dir);
                    }

                    if (videoJson.neo_id !== folderName) {
                        flagToDelete = true;//TODO: REMOVE IN FUTURE
                        await RNFS.moveFile("file://" + dir, "file://" + dir.substr(0,dir.lastIndexOf('/')+1) + videoJson.neo_id);
                        dir = dir.substr(0,dir.lastIndexOf('/')+1) + videoJson.neo_id;
                    }
                    
                    flagToDelete = false;//TODO: REMOVE IN FUTURE

                    video.title = videoJson.title.replace(/\"/g,'\\"');
                    video.id = videoJson.neo_id;
                    video.desc = videoJson.description.replace(/\"/g,'\\"')||"";
                    
                    video.keywords = videoJson.keywords.replace(/\"/g,'\\"');
                    if((!("asset_id" in videoJson)  || !("remote_url" in videoJson))) {
                        let {asset_id, url} = await VideoService.getAssetIdAndRemoteUrl(videoJson.neo_id);
                        video.asset_id = asset_id;
                        video.remote_url = url;
                        videoJson.asset_id = asset_id;
                        videoJson.remote_url = url;
                        let stringJson = JSON.stringify(videoJson);
                        await RNFS.writeFile("file://" + dir + '/video.json', stringJson, 'utf8');
                    } else {
                        video.asset_id = videoJson.asset_id;
                        video.remote_url = videoJson.remote_url;
                    }
                    resolve(video);
                } catch (e) {
                    console.log('ERROR!! CANNOT READ JSON FILE', e); 
                    if (flagToDelete) {
                        RNFS.unlink("file://" + dir);
                    }
                    return reject()
                }

                if (await RNFS.exists("file://" + dir + '/thumbnail.jpg')) {
                    video.thumbnail = "file://" + dir + '/thumbnail.jpg';
                } else {
                    return reject('Thumbnail Not Found for ',dir);
                }
                if (await RNFS.exists("file://" + dir + '/video.mp4')) {
                    video.video = "file://" + dir + '/video.mp4';
                } else {
                    return reject('Video Not Found for ',dir);
                }
                let toBeRejected = true;
                if (await RNFS.exists("file://" + dir + '/big.jpg')) {
                    toBeRejected = false;
                    video.big = "file://" + dir + '/big.jpg';
                } else {
                    video.big = '';
                }
                if (await RNFS.exists("file://" + dir + '/mid.jpg')) {
                    toBeRejected = false;
                    video.mid = "file://" + dir + '/mid.jpg';
                } else {
                    video.mid = '';
                }
                if (toBeRejected) {
                    return reject('Mid or Big Image Not Found for ',dir);
                }

            } else {
                return reject();
            }
        });
    },
    prepareContents: function() {
        Database.run(`SELECT * FROM video_channels`).then(function (results) {
            if (!(results.rows.length > 0)) {
                return false;
            }

            let channels = [];
            for(let i=0; i<results.rows.length; i++) {
                channels.push(results.rows.item(i));
            }

            this.addChannel(channels);
        }.bind(this)).catch(e => {
            console.error('This might be a error causing, "Possible Unhandled Promise Rejection" and "Attempt to get length of null array"',e);
        });
    },
    getChannelById: function(channelID) {
        return new Promise(function(resolve, reject) {
            let channelById =  this.xplayChannels.filter(channel => {
                return (channel.id === channelID);
            });
            if (channelById.length === 1) {
                resolve(channelById[0]);
            } else {
                return reject();
            }
        }.bind(this));
    },
    getVideosForChannel: function(channelID) {
        return new Promise(function(resolve, reject) {
            let sql = `SELECT 
                        channel.id AS channelId, 
                        channel.channelId AS channelServerId, 
                        video.id AS id, 
                        video.videoId AS videoId, 
                        video.videoTitle AS title, 
                        video.videoDesc AS description, 
                        video.keywords AS keywords, 
                        video_assets.local_url AS video_url, 
                        video.videoThumbnail AS thumbnail, 
                        video.markDeleted AS deleted 
                    FROM videos AS video, video_channels AS channel , video_assets AS video_assets
                    WHERE 
                        video.videoURL = video_assets.asset_id AND
                        video.channelId = channel.id AND 
                        video.markDeleted = 0 AND 
                        video.channelId = ?
                    Order By video.id`;
            
            Database.run(sql, [channelID]).then(results => {
                let videos = [];
                if (!(results.rows.length > 0)) {
                    return reject();
                }
                for (let i=0;i<results.rows.length;i++) {
                    videos.push(results.rows.item(i));
                }
                resolve(videos);
            }).catch(e => {
                console.log('ERROR, WHILE FETCHING VIDEOS', e);
                return reject();
            })
        }.bind(this));
    },
    addChannel: function(channel) {
        let channelList = [];
        for (let i=0;i<channel.length;i++) {
            if ('markDeleted' in channel) {
                if (channel[i].markDeleted === '1' || channel[i].markDeleted === 1) {
                    return;
                }
            }
    
            let thisChannel = {
                id: channel[i].id,
                channelId: channel[i].channelId,
                name: channel[i].channelName,
                icon: channel[i].channelIcon,
                cover: channel[i].channelCover
            };
    
            channelList.push(thisChannel);
        }
        this.xplayChannels = channelList;
    },
    getVideosForTiles: function(sizes) {
        return new Promise(async function(resolve, reject) {
            await Database.run('UPDATE videos SET mainScreenFlag=0 WHERE mainScreenFlag=1');
            
            let sortedSize = [];
            for (let size in sizes) {
                sortedSize.push([size, sizes[size]]);
            }

            //Sort as per the count
            sortedSize = sortedSize.sort(function(a, b) {
                return a[1] - b[1];
            });

            sizes = {};
            for (let i=0; i<sortedSize.length; i++) {
                sizes[sortedSize[i][0]] = sortedSize[i][1]
            }

            let toReturn = [];
            var count = 0;

            function fetchVideosFromSQL(sql, sizeToUpper) {
                return new Promise(function (resolve, reject) {
                    Database.run(sql).then(results => {
                        if (!(results.rows.length > 0)) {
                            console.log('ERROR!!! Nothing to return from Videos Table for Tiles');
                            return reject();
                        }

                        let columnsToUpdate = [];
                        let videosToReturn = [];
                        for(let i=0 ; i<results.rows.length ; i++) {
                            let video = results.rows.item(i);
                            columnsToUpdate.push(video.id);
                            video['img'+sizeToUpper] = video[`videoImage${sizeToUpper}`];
                            delete video[`videoImage${sizeToUpper}`];
                            video.type = "xplay";
                            videosToReturn.push(video);
                        }

                        if (columnsToUpdate.length > 0) {
                            let colms = columnsToUpdate.join(',');
                            columnsToUpdateQuery = "UPDATE videos SET mainScreenFlag=1 WHERE id in (" + colms + ")";
                            Database.run(columnsToUpdateQuery).then(() => {
                                resolve(videosToReturn);
                            }).catch(e => {
                                console.log('ERROR! While Updating videos table for main tiles', e);
                            });
                        } else {
                            console.log('This will never reach here. Videos are already present');
                            return reject();
                        }
                    });
                });
            }

            for (let size in sizes) {
                let sizeToUpper = size.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                    return letter.toUpperCase();
                });

                let sql = `SELECT 
                            videos.id AS id, 
                            videos.videoId AS neo_id, 
                            videos.channelId AS channelId, 
                            videos.videoTitle AS videoTitle, 
                            videos.keywords AS keywords, 
                            video_assets.local_url AS content_url, 
                            video_assets.remote_url AS remote_url, 
                            videos.videoImage${sizeToUpper} AS videoImage${sizeToUpper}
                        FROM 
                            videos, video_assets
                        WHERE 
                            videos.videoURL = video_assets.asset_id AND
                            mainScreenFlag=0 
                            AND 
                            videoImage${sizeToUpper} IS NOT NULL 
                        order by RANDOM()
                        LIMIT ${sizes[size]}`;
                count++;
                
                let videos = await fetchVideosFromSQL(sql, sizeToUpper);
                toReturn = toReturn.concat(videos);
                if (count >= Object.keys(sizes).length) {
                    resolve(toReturn);
                }
            }
        }.bind(this));
    }
}

export default VideoService;
