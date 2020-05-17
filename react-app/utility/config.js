const config = {
    env: 'dev',
    isDemo: false,
    appVersion: "1.6.0",
    videoLoadTimeout: 60, //in seconds
    videoAdsDuration: (6.5*60),
    volumeBarDisapper: 10000, //in mili seconds.
    tileReload: 13, //in minutes
    autoScrollTime: 20000, //in mili seconds
    autoScrollRestartAfterTouch: 25000, //in mili seconds
    resetTimeOnInactivity: 13, //in minutes. Reset if no touch
    playAutoVideoAds: 18, //in minutes. If no one touches the tab
    screenTurnOnTime: 11, //in minutes. turn on screen if someone switched it off.
    downloadSyncTime: 12, //in hours,
    sweetVideoPlayTime: 6, //Time that someone can watch a content without getting ads - in minutes
    faceAvailabilityTimeout: 5,
    local : {
        url: 'http://d8ed35bf.ngrok.io/',
        logging_url: 'https://dev.logger.xwards.com'
    },
    dev: {
        url: 'https://dev.api.xwards.com',
        logging_url: 'https://dev.logger.xwards.com'
    },
    test: {
        url: 'https://test.api.xwards.com',
        logging_url: 'https://test.logger.xwards.com'
    },
    prod: {
        url: 'https://api.xwards.com',
        logging_url: 'https://logger.xwards.com'
    },
    routes: {
        NEWSREACH: function() {
            return "http://newsreach.in/ciapi/allnrfeeds/";
        },
        LOGSERVER: function() {
            return config[config.env].logging_url;
        },
        registerPage: {
            pingServerURL: function(androidId) {
                return config[config.env].url+'/operators/device/checkdevice/'+androidId;
            },
            submitOTP: function() {
                return config[config.env].url+'/operators/device/submitotp';
            }
        },
        dataSync: {
            deletedContents: function() {
                return config[config.env].url + "/x-play/deleted-contents";
            },
            videoList: function() {
                return config[config.env].url + "/x-play/channel-video";
            },
            findAssetId: function(id) {
                return config[config.env].url + '/x-play/get-asset-id/'+id;
            },
            deleteAds: function() {
                return config[config.env].url + "/campaign/deleted-vid-ads";
            }
        },
        Ads: {
            fetchVideoAds: function() {
                return config[config.env].url+'/campaign/video-ads';
            },
            fetchCampaignVideoAds: function() {
                return config[config.env].url + '/campaign/campaign-video-ads'
            }
        }
    },
    syncing : {
        newsSync: 3*60, //Syncing time for news in minutes
    }
};

export default config;