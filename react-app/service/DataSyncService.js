import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import axios from 'axios';
import Config from '../utility/config';
import Database from './DatabaseService';
import VideoService from './VideoService';

const DataSyncService = {
    addToDownloadQueue: function(val) {
        let createdAt = new Date();
        createdAt = parseInt(createdAt.getTime()/1000);
        try {
            Database.run(`INSERT INTO download_manager (type, file_name, destination, remote_url, mime, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                val.type,val.name,val.destination,val.remote_url,val.mime,-1, createdAt]);
        } catch (e) {
            console.log('Skipping ', remote_url, val.name);
        }
    },

    startDownload: function() {
        this.nextDownload().then(function () {
            this.startDownload();
        }.bind(this)).catch(function() {
            var _this = this;
            _this.deleteExtraFiles().then(function () {
                _this.syncDeleteAds().then(()=> {
                    _this.syncDeleteContents().then(() => {
                        VideoService.syncContents().then(() => {
                            VideoService.prepareContents();
                        })
                    }).catch(e => {
                        VideoService.syncContents().then(() => {
                            VideoService.prepareContents();
                        })
                        console.log('Sync Delete Contents Exception', e);
                    })
                }).catch(error=> {
                    console.log(error);
                    VideoService.syncContents().then(() => {
                        VideoService.prepareContents();
                    })
                })
            }).catch(e => {
                console.log('File Doesn\'t exist',e);
            })
        }.bind(this))
    },

    syncDeleteAds: function() {
        return new Promise(function (resolve, reject) {
            var directory = "/storage/emulated/0/Xwards/Ads/VideoAds/";
            let deletedContentsUrl = Config.routes.dataSync.deleteAds();
            axios({
                method: 'GET',
                url: deletedContentsUrl,
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response=> {
                //Delete Content from Ads.
                for (let i=0 ; i<response.data.length ; i++) {
                    let toDeleteAds = response.data[i];
                    if(toDeleteAds.deleted_at !== null) {
                        var fileName = toDeleteAds.company_name + "_"+ toDeleteAds.id + "_ad.mp4";
                        RNFS.exists('file://' + directory + fileName).then(flag=> {
                            if(flag) {
                                try {
                                    RNFS.unlink(directory + fileName);
                                    let sql = `DELETE FROM video_ads WHERE campaign_id = ${toDeleteAds.id}`
                                    Database.run(sql).then(response => {
                                        console.log('Video ID:', toDeleteAds.id + 'Video Deleted from local and database: ,', response);
                                    })
                                } catch(error) {
                                    console.log('Unable to delete the video ad file.', error);
                                }
                            }
                        })
                    }
                }
                return resolve();
            }).catch(e => {
                console.log('Axios Call Error',e);
                return reject();
            })
        });
    },

    syncDeleteContents: function() {
        return new Promise(function (resolve, reject) {
            var directory = "/storage/emulated/0/Xwards/Videos/";
            let deletedContentsUrl = Config.routes.dataSync.deletedContents();
            axios({
                method: 'GET',
                url: deletedContentsUrl,
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response=> {
                for (let i=0 ; i<response.data.length ; i++) {
                    let toDelete = response.data[i];
                    if(toDelete.deleted_at !== null) { //It must be channel delete the channel if it exits.
                        RNFS.exists('file://' + directory + toDelete.id).then(flag => {
                            if (flag) { //If file exists then do anything else don't do anything.
                                try {
                                    RNFS.unlink(directory + toDelete.id);
                                } catch (e) {
                                    console.log('Unable to delete the file.', e);
                                }
                            }
                        }).catch(e => {
                            console.log('RNFS Exits Exception.',e);
                        })
                    } else {
                        if (toDelete.ChannelVideo !== undefined && typeof toDelete.ChannelVideo === 'object') {
                            //Delete the videos - Start itterating.
                            for (let y=0 ; y<toDelete.ChannelVideo.length ; y++) {
                                let ch_video = toDelete.ChannelVideo[y];
                                let pathToVideo = directory + toDelete.id + "/" + ch_video.neo_id;
                                RNFS.exists(pathToVideo).then(flag => {
                                    if (flag) {
                                        try {
                                            RNFS.unlink(pathToVideo);
                                        } catch (e) {
                                            console.log('Unable to delete the file.', e);
                                        }
                                    }
                                }).catch(e => {
                                    console.log('RNFS Exits Exception.',e);
                                })
                            }
                        }
                    }
                }
                return resolve();
            }).catch(error=> {
                console.log(error);
                return reject();
            })
        });
    },

    deleteExtraFiles: function() {
        return new Promise(function(resolve, reject) {
            RNFS.readDir("/storage/emulated/0/Xwards/Videos").then(function (channels) {
                //Iterating on Videos Folder
                for (let i=0; i<channels.length; i++) {
                    let path = channels[i].path;

                    if (channels[i].isFile()) {
                        RNFS.unlink(path);
                        continue;
                    }

                    let folderName = path.substr(path.lastIndexOf('/')+1);
                    if(!folderName.match(/^\d+$/)) {
                        RNFS.unlink(path);
                        continue;
                    }

                    RNFS.readDir(path).then(function (videos) {
                        //Iterating Each Channel
                        for (let x=0; x<videos.length; x++) {
                            let videoPath = videos[x].path;
                            let videoFolderName = videoPath.substr(videoPath.lastIndexOf('/')+1); //Find the video folder name

                            if (videos[x].isFile()) {
                                let allowedFilesInsideEachChannel = ['channel.json', 'cover_photo.jpg', 'photo.jpg', 'cover_photo.jpeg', 'photo.jpeg'];
                                if (!allowedFilesInsideEachChannel.includes(videoFolderName)) {
                                    RNFS.unlink(videoPath);
                                    continue;
                                }
                            } else { //The path is a directory
                                //It must be a number.
                                if(!videoFolderName.match(/^\d+$/)) {
                                    RNFS.unlink(videoPath);
                                    continue;
                                }
                                //Read Each Video Folder.
                                RNFS.readDir(videoPath).then(function (videoFiles) {
                                    //Iterating inside videos folder
                                    for (let y=0; y<videoFiles.length; y++) {
                                        let videoFilePath = videoFiles[y].path;
                                        let videoFileName = videoFilePath.substr(videoFilePath.lastIndexOf('/')+1); //Find the video folder name

                                        //There should not be a diretory inside this folder.
                                        if (videoFiles[y].isDirectory()) {
                                            RNFS.unlink(videoFilePath);
                                            continue;
                                        }

                                        if (videoFileName.includes('video.mp4')) {
                                            continue;
                                        }

                                        let allowedFilesInsideEachVideo= ['video.json', 'big.jpg', 'mid.jpg', 'thumbnail.jpg', 'big.jpeg', 'mid.jpeg', 'thumbnail.jpeg'];
                                        if (!allowedFilesInsideEachVideo.includes(videoFileName)) {
                                            RNFS.unlink(videoFilePath);
                                            continue;
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                resolve();
            }).catch(e => {
                return reject();
            });
        });
    },

    nextDownload: function() {
        return new Promise (function (resolve, reject) {
            Database.run(`SELECT * FROM download_manager WHERE status=-1 LIMIT 1`).then(results => {
                if (!(results.rows.length > 0)) {
                    return reject();
                }
                let toDownload = results.rows.item(0);
                switch (toDownload.type) {
                    case 'image':
                        RNFetchBlob.config({
                            addAndroidDownloads: {
                                overwrite: true,
                                useDownloadManager: true,
                                mime: toDownload.mime,
                                notification: false,
                                path: toDownload.destination+toDownload.file_name,
                                description: 'File Downloaded',
                            }
                        }).fetch('GET', toDownload.remote_url).then((response) => {
                            Database.run(`UPDATE download_manager SET status=1 WHERE id=?`, [toDownload.id]).then(updateResult => {
                                return resolve();
                            }).catch(e => {
                                return reject();
                            })
                        }).catch((error)=> {
                            console.log('Image Error: ', error.message);
                            return reject();
                        });
                        break;
                    case 'video':
                        var dirs = RNFetchBlob.fs.dirs;
                        var filePath = `${dirs.DownloadDir}/${toDownload.id}_${toDownload.file_name}`;
                        RNFetchBlob.config({
                            addAndroidDownloads: {
                                overwrite: true,
                                useDownloadManager: true,
                                notification: true,
                                mime: toDownload.mime,
                                path: filePath,
                                description: 'Video Download'
                            }
                        }).fetch('GET', toDownload.remote_url).progress({ count : 10 }, (received, total) => {
                            Database.run(`UPDATE download_manager SET status=0 WHERE id=? AND status=-1`, [toDownload.id]);
                        }).then((response)=> {
                            var modifiedDownloadedFilePath = 'file://'+filePath;
                            var destinedFilePath = 'file://'+toDownload.destination+toDownload.file_name;
                            RNFS.moveFile(modifiedDownloadedFilePath, destinedFilePath).then((response)=> {
                                console.log('Response of moving file', destinedFilePath);
                                Database.run(`UPDATE download_manager SET status=1 WHERE id=?`, [toDownload.id]).then(updateResult => {
                                    VideoService.syncContents().then(() => {
                                        VideoService.prepareContents();
                                        return resolve();
                                    })
                                }).catch(e => {
                                    return reject();
                                })
                            }).catch((error)=> {
                                console.log('Error in moving file: ', error);
                                return reject();
                            })
                        })
                        .catch((error)=> {
                            console.log('Video Error', error);
                        })
                        break;
                    case 'video_ad':
                        var dirs = RNFetchBlob.fs.dirs;
                        var filePath = `${dirs.DownloadDir}/${toDownload.id}_${toDownload.file_name}`;

                        RNFetchBlob.config({
                            addAndroidDownloads: {
                                overwrite: true,
                                useDownloadManager: true,
                                notification: true,
                                mime: toDownload.mime,
                                path: filePath,
                                description: 'Ad Video Download'
                            }
                        }).fetch('GET', toDownload.remote_url).progress({ count : 10 }, (received, total) => {
                            Database.run(`UPDATE download_manager SET status=0 WHERE id=? AND status=-1`, [toDownload.id]);
                        }).then((response)=> {
                            var modifiedDownloadedFilePath = 'file://'+filePath;
                            var destinedFilePath = 'file://'+toDownload.destination+'/'+toDownload.file_name;
                            RNFS.moveFile(modifiedDownloadedFilePath, destinedFilePath).then((response)=> {
                                console.log('Response of moving file', destinedFilePath);
                                Database.run(`UPDATE download_manager SET status=1 WHERE id=?`, [toDownload.id]).then(updateResult => {
                                    Database.run(`UPDATE video_ads SET local_url=? WHERE remote_url=?`, [destinedFilePath, toDownload.remote_url]).then(updateResult => {
                                        return resolve();
                                    })
                                }).catch(e => {
                                    return reject();
                                })
                            }).catch((error)=> {
                                console.log('Error in moving file: ', error);
                                return reject();
                            })
                        });
                        break;
                }
            });
        })
    },

    init: function() {
        console.log('Datasync Initialized');
        return new Promise (function (resolve, reject) {
            let _this = this;
            let videoSyncUrl = Config.routes.dataSync.videoList()
            axios({
                method: 'GET',
                url: videoSyncUrl,
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async function (response) {
                let channels = response.data;
                
                let folderName = 'Xwards';
                //Safe side - Check if `Xwards` folder is present or not. If not create it.
                if (!await RNFS.exists(`file:///storage/emulated/0/${folderName}/`)) {
                    await RNFS.mkdir(`file:///storage/emulated/0/${folderName}/`);
                }
                //Safe side - Check if `Xwards/Videos` folder is present or not. If not create it.
                if (!await RNFS.exists(`file:///storage/emulated/0/${folderName}/Videos/`)) {
                    await RNFS.mkdir(`file:///storage/emulated/0/${folderName}/Videos/`);
                }
                //Base path for all the videos
                let videoBasePath = `/storage/emulated/0/${folderName}/Videos/`;
    
                for (let x=0; x<channels.length ; x++) {
                    let channel = channels[x];
                    //If the channel folder is not present then create it
                    if (!await RNFS.exists("file://"+videoBasePath + channel.id)) {
                        await RNFS.mkdir("file://" + videoBasePath + channel.id)
                    }
                    //If channel logo is not present then add it for downloading queue.
                    if (!await RNFS.exists("file://"+videoBasePath + channel.id + '/' + 'photo.jpg')) {
                        _this.addToDownloadQueue({
                            type: 'image',
                            destination: videoBasePath + channel.id + '/',
                            mime: 'image/jpeg',
                            name: 'photo.jpg',
                            remote_url: channel.photo
                        })
                    }
                    //If the channel cover is not present then add it for downloading queue.
                    if (!await RNFS.exists("file://"+videoBasePath + channel.id + '/' + 'cover_photo.jpg')) {
                        _this.addToDownloadQueue({
                            type: 'image',
                            destination: videoBasePath + channel.id + '/',
                            mime: 'image/jpeg',
                            name: 'cover_photo.jpg',
                            remote_url: channel.cover_photo
                        })
                    }
                    //If channel json file is not present create it.
                    if(!await RNFS.exists("file://"+videoBasePath + channel.id + "/channel.json")) {
                        _this.makeJson(channel, "file://"+videoBasePath + channel.id + "/", 'channel.json');
                    }
    
                    //Start iterating for channel videos
                    for (let y=0; y<channel.ChannelVideo.length ; y++) {
                        let video = channel.ChannelVideo[y];
    
                        //Create video folder if not exits
                        if (!await RNFS.exists("file://"+videoBasePath + channel.id + "/" + video.neo_id)) {
                            await RNFS.mkdir("file://" + videoBasePath + channel.id + "/" + video.neo_id)
                        }
                        //Create the JSON file if not present
                        if(!await RNFS.exists("file://" + videoBasePath + channel.id + "/" + video.neo_id + "/" + "video.json")) {
                            _this.makeJson(video, "file://" + videoBasePath + channel.id + "/" + video.neo_id + "/", "video.json");
                        }
    
                        //If the thumbnail is not present then push it in downloading queue.
                        if(!await RNFS.exists("file://" + videoBasePath + channel.id + "/" + video.neo_id + "/" + "thumbnail.jpg")){
                            _this.addToDownloadQueue({
                                type: 'image',
                                destination: videoBasePath + channel.id + "/" + video.neo_id + "/",
                                mime: 'image/jpeg',
                                name: 'thumbnail.jpg',
                                remote_url: video.thumbnail
                            })
                        }
    
                        //If the mid size image is not present then push it in downloading queue.
                        if(!await RNFS.exists("file://" + videoBasePath + channel.id + "/" + video.neo_id + "/" + "mid.jpg")){
                            _this.addToDownloadQueue({
                                type: 'image',
                                destination: videoBasePath + channel.id + "/" + video.neo_id + "/",
                                mime: 'image/jpeg',
                                name: 'mid.jpg',
                                remote_url: video.midImg
                            })
                        }
    
                        //If the big size image is not present then push it in downloading queue.
                        if(!await RNFS.exists("file://" + videoBasePath + channel.id + "/" + video.neo_id + "/" + "big.jpg")){
                            _this.addToDownloadQueue({
                                type: 'image',
                                destination: videoBasePath + channel.id + "/" + video.neo_id + "/",
                                mime: 'image/jpeg',
                                name: 'big.jpg',
                                remote_url: video.bigImg
                            })
                        }
    
                        //Download Video MP4 if not present
                        if(!await RNFS.exists("file://" + videoBasePath + channel.id + "/" + video.neo_id + "/" + "video.mp4")) {
                            _this.addToDownloadQueue({
                                type: 'video',
                                destination: videoBasePath+ channel.id+ "/" + video.neo_id + "/",
                                mime: 'video/mp4',
                                name: 'video.mp4',
                                remote_url: video.url
                            })
                        }
                    }
                }
                resolve();
            }.bind(_this)).catch((e)=> {
                console.log('Unable to reach the server for Fetching the contents.', e);
                return reject();
            })
        }.bind(this));
    },

    //Write or Create JSON File
    makeJson: function (data, path, fileName) {
        var jsonFilePath = path + fileName;
        RNFS.writeFile(jsonFilePath, JSON.stringify(data), 'utf8')
        .then((success) => {
            console.log('File Written');
        })
        .catch((error)=> {
            console.log('Error', error.message);
        })
    },

    clearDownloadDirectory() {
		return new Promise(function (resolve, reject) {
            let dirs = RNFetchBlob.fs.dirs;
            let downLoadDir = `${dirs.DownloadDir}`;
            RNFS.readDir(downLoadDir).then(async function (files) {
                for (let i=0; i<files.length; i++) {
                    let file = files[i];
                    try {
                        await RNFS.unlink(file);
                    } catch(e) {
                        console.log('Cannot delete ', file, 'ERROR....',e);
                    }
                }
                resolve();
            }).catch(e => {
                return reject(e);
            })
		})
	}
}

export default DataSyncService;