import axios from "axios";
import config from '../utility/config';
import DataSyncService from "./DataSyncService";
import RNFS from 'react-native-fs';
import Database from './DatabaseService';

const AdsManager = {
    videoAd: null,
    fullAd: [],
    largeAd: [],
    syncTime: 0,
    fetchVideoAd: function() {
        return new Promise(function (resolve, reject) {
            let fetchVideoAdUrl = config.routes.Ads.fetchCampaignVideoAds();
            axios({
                method: 'GET',
                url: fetchVideoAdUrl,
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async function (results) {
                console.log('VideoAds:', results);
                let ads = results.data;
                let folderName = 'Xwards';
                //Safe side - Check if `Xwards` folder is present or not. If not create it.
                if (!await RNFS.exists(`file:///storage/emulated/0/${folderName}/`)) {
                    await RNFS.mkdir(`file:///storage/emulated/0/${folderName}/`);
                }
                //Safe side - Check if `Xwards/Ads` folder is present or not. If not create it.
                if (!await RNFS.exists(`file:///storage/emulated/0/${folderName}/Ads/`)) {
                    await RNFS.mkdir(`file:///storage/emulated/0/${folderName}/Ads/`);
                }
                //Safe Side - Check if `Xwards/Ads/VideoAds` folder is present or not. If not create it.
                if (!await RNFS.exists(`file:///storage/emulated/0/${folderName}/Ads/VideoAds`)) {
                    await RNFS.mkdir(`file:///storage/emulated/0/${folderName}/Ads/VideoAds`);
                }
                //Base path for all the videos
                let AdsBasePath = `/storage/emulated/0/${folderName}/Ads/VideoAds`;

                for (let x=0; x<ads.length ; x++) {
                    let Ad = ads[x];
                    let local_url = '';
                    //If the channel folder is not present then create it
                    if (!await RNFS.exists(`file://${AdsBasePath}/${Ad.company_name}_${Ad.id}_ad.mp4`)) {
                        DataSyncService.addToDownloadQueue({
                            type: 'video_ad',
                            destination: AdsBasePath,
                            mime: 'video/mp4',
                            name: `${Ad.company_name}_${Ad.id}_ad.mp4`,
                            remote_url: Ad.url
                        });
                    } else {
                        local_url=`file://${AdsBasePath}/${Ad.company_name}_${Ad.id}_ad.mp4`
                    }
                    //Try to insert in the database.
                    let sql = `INSERT OR IGNORE INTO video_ads (campaign_id, remote_url, local_url, meta_data, toDownload, last_used, size, impressions, createdAt) values (?,?,?,?,?,?,?,?,?)`;
                    let toInsert = [];
                    let createdAt = new Date();
                    createdAt = parseInt(createdAt.getTime()/1000);
                    //TO DO Write some code here. to create it..
                    toInsert.push(Ad.id); //campaign_id
                    toInsert.push(Ad.url); //remote_url
                    toInsert.push(local_url); //local_url
                    toInsert.push(0); //meta_data
                    toInsert.push(1); //toDownload
                    toInsert.push(0); //last_used
                    toInsert.push(0); //size
                    toInsert.push(0); //impressions
                    toInsert.push(createdAt); //createdAt
                    try {
                        /**
                         * Insert into the ads_video
                         */
                        Database.run(sql, toInsert).then(function(response) {
                            console.log('Successfully Inserted in the table:,', response );
                        }).catch(function(error) {
                            console.log('Database entry error: ,', error);
                        })
                    } catch (e) {
                        console.log(e);
                    }
                }
                resolve();
            }).catch(e => {
                console.warn('Unable to fetch data', e);
                return reject();
            })
        });
    },
    nextVideoAds: function(localFlag) {
        return new Promise (function (resolve, reject) {
            let sql = `SELECT * FROM video_ads ORDER BY impressions ASC, last_used ASC LIMIT 1`;
            if (localFlag) {
                sql = `SELECT * FROM video_ads WHERE local_url <> '' ORDER BY impressions ASC, last_used ASC LIMIT 1`;
            }
            Database.run(sql).then(results => {
                if (results.rows.length !== 1) {
                    return reject();
                }

                return resolve(results.rows.item(0));
            })
        });
    },
    markImpression: function (videoAd) {
        return new Promise (function (resolve, reject) {
            let createdAt = new Date();
            createdAt = parseInt(createdAt.getTime()/1000);
            Database.run(`UPDATE video_ads SET impressions=impressions+1, last_used=? WHERE id=?`, [createdAt, videoAd.id]).then(results => {
                return resolve();
            }).catch(e => {
                return reject();
            })
        });
    },
    fetchImageAds: function() {
        Axios.get(config[config.env].url+'/campaign/image-ads/large').then(function (res) {
            console.log(res.data);
        }.bind(this)).catch((e)=> {
            console.log('Error calling URI', config[config.env].url+'/campaign/image-ads/large', e);
        });

        Axios.get(config[config.env].url+'/campaign/image-ads/full').then(function (res) {
            console.log(res.data);
        }.bind(this)).catch((e)=> {
            console.log('Error calling URI', config[config.env].url+'/campaign/image-ads/full', e);
        });
    },
    setVideoAd: function(video) {
        this.videoAd = video;
    },
    getVideoAd: function() {
        return this.videoAd;
    },
    addFullAd: function(Ad) {
        this.fullAd.push(Ad);
    },
    setFullAds: function(Ads) {
        this.fullAd = Ads;
    },
    getFullAd: function() {
        let adToReturn = this.fullAd[0];
        this.fullAd.shift();
        return adToReturn;
    },
    addLargeAd: function(Ad) {
        this.largeAd.push(Ad);
    },
    setLargeAds: function(Ads) {
        this.largeAd = Ads;
    },
    getLargeAd: function() {
        let adToReturn = this.largeAd[0];
        this.largeAd.shift();
        return adToReturn;
    }
}

export default AdsManager;
