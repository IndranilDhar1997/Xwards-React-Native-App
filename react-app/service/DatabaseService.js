import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = "XploreApp.db";
const database_version = "1.0";
const database_displayname = "Xplore App Database";
const database_size = 200000;

const DatabaseService = {
    dbInstance: null,
    initDB: function() {
        return new Promise((resolve, reject) => {
            console.log("Database Plugin Check....");
            SQLite.echoTest().then(() => {
                console.log("Database integrity check passed ...");
                console.log("Opening database ...");
                SQLite.openDatabase(database_name, database_version, database_displayname, database_size).then(DB => {
                    this.dbInstance = DB;
                    console.log("Database OPEN");
                    this.dbInstance.executeSql('SELECT 1 FROM android_metadata LIMIT 1').then(() => {
                        console.log("Database is ready ... executing query ...");
                        resolve();
                    }).catch((error) => {
                        console.log("Database received error: ", error);
                        console.log("Database not yet ready ... populating data");
                        return reject();
                    });
                }).catch(error => {
                    console.log(error);
                    return reject(error);
                });
            }).catch(error => {
                console.log("echoTest failed - plugin not functional");
                return reject(error);
            });
        });
    },
    closeDatabase: function() {
        if (this.dbInstance) {
            console.log("Closing DB");
            this.dbInstance.close().then(status => {
                console.log("Database CLOSED");
            }).catch(error => {
                this.errorCB(error);
            });
        } else {
            console.log("Database was not OPENED");
        }
    },
    createTable(sql) {
        return new Promise(function(resolve, reject) {
            this.dbInstance.transaction((tx) => {
                tx.executeSql(sql);
            }).then(() => {
                resolve();
            }).catch(error => {
                console.log(error);
                return reject(error);
            });
        }.bind(this));
    },
    // initCrons: function() {
    //     this.createTable(`CREATE TABLE IF NOT EXISTS crons (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         last_run_time INTEGER,
    //         next_run_time INTEGER,
    //         duration INTEGER,
    //         method_name TEXT UNIQUE
    //     )`);
    // },
    initLogs: function() {
        return new Promise(function (resolve, reject) {
            this.createTable(`CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log TEXT,
                markDeleted INTEGER(1)
            )`).then(() => {
                console.log('Logs table created successfully');
                resolve();
            }).catch(() => {
                console.log('Creating News Table Failed - Logs');
                return reject();
            })
        }.bind(this));
    },
    initNews: function() {
        return new Promise(function (resolve, reject) {
            this.createTable(`CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contentUrl TEXT UNIQUE,
                sentFlag NUMERIC,
                mainScreenFlag NUMERIC,
                contentTitle TEXT,
                coverImg TEXT,
                contentHtml TEXT,
                keywords TEXT,
                category TEXT,
                partner TEXT,
                partnerLogo TEXT,
                time INTEGER,
                createdAt INTEGER,
                expiry INTEGER
            )`).then(() => {
                console.log('News Table Created Successfully');
                resolve();
            }).catch(() => {
                console.log('Creating News Table Failed - News');
                return reject();
            })
        }.bind(this));
    },
    initVideos: function() {
        return new Promise(function (resolve, reject) {
            let _this = this;
            this.createTable(`CREATE TABLE IF NOT EXISTS video_channels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channelId INTEGER UNIQUE,
                channelName TEXT,
                channelDesc TEXT,
                channelIcon TEXT,
                channelCover TEXT,
                createdAt INTEGER,
                markDeleted INTEGER(1)
            )`).then(function () {
                let that = _this;
                console.log('Table for Video Channels Created');
                _this.createTable(`CREATE TABLE IF NOT EXISTS videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    videoId INTEGER UNIQUE,
                    channelId INTEGER,
                    videoTitle TEXT,
                    videoDesc TEXT,
                    keywords TEXT,
                    videoURL TEXT,
                    videoThumbnail TEXT,
                    videoImageBig TEXT,
                    videoImageMid TEXT,
                    total_duration INTEGER NOT NULL default 0,
                    size INTEGER NOT NULL default 0,
                    createdAt INTEGER,
                    markDeleted INTEGER(1),
                    mainScreenFlag NUMERIC
                )`).then(async function () {
                    console.log('Videos table created');
                    try {
                        await that.createTable(`ALTER TABLE videos ADD COLUMN total_duration INTEGER NOT NULL default 0`);
                    } catch (e) {
                        console.log('Unable to alter the table because', e);
                    }
                    try {
                        await that.createTable(`ALTER TABLE videos ADD COLUMN size INTEGER NOT NULL default 0`);
                    } catch (e) {
                        console.log('Unable to alter table because', e);
                    }
                    resolve();
                }.bind(that)).catch((e) => {
                    console.log('Videos table could not be created.',e );
                    return reject();
                });
            }.bind(_this)).catch((e) => {
                console.log('Table for video channels failed - Channels',e );
                return reject();
            });
        }.bind(this));
    },
    initAssetsTable: function() {
        return new Promise(function (resolve, reject) {
            this.createTable(`CREATE TABLE IF NOT EXISTS video_assets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                asset_id TEXT UNIQUE,
                remote_url TEXT UNIQUE,
                local_url TEXT UNIQUE,
                is_main INTEGER,
                duration INTEGER,
                sequence_number INTEGER,
                mime_type TEXT,
                last_used INTEGER,
                size INTEGER,
                impressions INTEGER,
                createdAt INTEGER,
                expiry INTEGER
            )`).then(() => {
                console.log('Video Assets Table Created Successfully');
                resolve();
            }).catch(e => {
                console.log('Creating Video Assets Table Failed', e);
                return reject();    
            });
        }.bind(this));
    },
    initDownloadTable: function() {
        return new Promise(function (resolve, reject) {
            this.createTable(`CREATE TABLE IF NOT EXISTS download_manager (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                file_name TEXT,
                destination TEXT,
                remote_url TEXT,
                mime TEXT,
                status INTEGER,
                createdAt INTEGER,
                UNIQUE(remote_url,destination)
            )`).then(() => {
                console.log('Download Manager Table Created Successfully');
                resolve();
            }).catch(e => {
                console.log('Creating Download Manager Table Failed', e);
                return reject();    
            });
        }.bind(this));
    },
    initAdvertisementTable() {
        return new Promise(function (resolve, reject) {
            this.createTable(`CREATE TABLE IF NOT EXISTS video_ads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id INTEGER UNIQUE NOT NULL,
                remote_url TEXT UNIQUE NOT NULL,
                local_url TEXT,
                meta_data TEXT,
                toDownload INTEGER DEFAULT 0,
                last_used INTEGER,
                size INTEGER,
                impressions INTEGER,
                createdAt INTEGER
            )`).then(() => {
                console.log('Video Ads Table Created Successfully');
                resolve();
            }).catch(e => {
                console.log('Creating Video Ads Table Failed', e);
                return reject();    
            });
        }.bind(this));
    },
    initTables: function() {
        console.log('Creating Tables');
        return new Promise(async function (resolve, reject) {
            await this.initVideos();
            await this.initNews();
            await this.initLogs();
            await this.initAssetsTable();
            await this.initDownloadTable();
            await this.initAdvertisementTable();
            resolve();
        }.bind(this));
    },

    run(sql, data) {
        data = data || [];
        return new Promise(function(resolve, reject) {
            this.dbInstance.transaction((tx) => {
                tx.executeSql(sql, data).then(([tx, results]) => {
                    resolve(results);
                }).catch(e => {
                    return reject(e);
                })
            }).then(() => {
                //resolve();
            }).catch(error => {
                return reject(error);
            });
        }.bind(this));
    }
}

export default DatabaseService;