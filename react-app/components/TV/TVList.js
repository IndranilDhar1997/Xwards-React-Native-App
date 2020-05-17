export default [
    {
        id: 1,
        name: 'Zee News Live',
        thumbnail: require('./thumbnails/zee-news.jpg'),
        description: '',
        url: function() {
            //https://z5ams.akamaized.net/zeenews/index.m3u8?hdnts=st=1567787891~exp=1567790891~acl=/*~hmac=86820a747355e318ddcc0e8913e7a784f932c66c9edb318149de6810a2d6b2bf
            return new Promise (function (resolve,reject) {
                fetch('https://www.zeebiz.com/micros/live-tv-token.php')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        resolve('https://z5ams.akamaized.net/zeenews/index.m3u8'+responseJson.video_token);
                }).catch((error) => {
                    return reject(error);
                });
            });
        },
        player: 'native'
    },
    {
        id: 2,
        name: 'NDTV India',
        thumbnail: require('./thumbnails/ndtv.jpg'),
        description: '',
        url: 'https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/ndtv24x7master.m3u8',
        player: 'native'
    },
    {
        id: 3,
        name: 'Zee Business',
        thumbnail: require('./thumbnails/zee-business.jpg'),
        description: '',
        url: function() {
            return new Promise (function (resolve,reject) {
                fetch('https://www.zeebiz.com/micros/live-tv-token.php')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        resolve('https://z5ams.akamaized.net/zeebusiness/index.m3u8'+responseJson.video_token);
                }).catch((error) => {
                    return reject(error);
                });
            });
        },
        player: 'native'
    },
    {
        id: 4,
        name: 'India TV News',
        thumbnail: require('./thumbnails/india-tv-news.jpg'),
        description: '',
        url: 'https://live-indiatvnews.akamaized.net/indiatv-origin/liveabr/playlist.m3u8',
        player: 'native'
    },
    {
        id: 5,
        name: 'ABP News Live',
        thumbnail: require('./thumbnails/abp-news.jpg'),
        description: '',
        url: 'https://abp-i.akamaihd.net/hls/live/765529/abphindi/master.m3u8',
        player: 'native'
    }
    // {
    //     id: 2,
    //     name: 'Aaj Tak',
    //     thumbnail: require('./thumbnails/aaj-tak.jpg'),
    //     description: '',
    //     url: 'nGWA-8p4Q30',
    //     fullUrl: 'https://www.youtube.com/embed/nGWA-8p4Q30',
    //     player: 'youtube'
    // },
    // {
    //     id: 3,
    //     name: 'India Today',
    //     thumbnail: require('./thumbnails/india-today.jpg'),
    //     description: '',
    //     url: 'arhjhHeuRUc',
    //     fullUrl: 'https://www.youtube.com/embed/arhjhHeuRUc',
    //     player: 'youtube'
    // },
    // {
    //     id: 4,
    //     name: 'CNN News 18',
    //     thumbnail: require('./thumbnails/cnn-news-18.jpg'),
    //     description: '',
    //     url: 'https://cnnnews18-lh.akamaihd.net/i/cnnnews18_1@174950/master.m3u8?hdnts=st=1567690655~exp=1567693655~acl=/*~hmac=40c3effc70f91083d9e8fe68822dbaaaf4a3679b69e045ccfd88b08bcf6f7f63'
    // },
]