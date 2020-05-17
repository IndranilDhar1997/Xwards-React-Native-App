/**
 * Sorting mechanism:
 *  1. Impression
 *  2. Latest
 */

//var components = [];
import config from '../utility/config';
import NewsService from './NewsService';
import VideoService from './VideoService';

const DataManager = {
    availableTileSizes: ['big', 'full', 'mid', 'large', 'small', 'wide'],
    data: null,
    loadedData: false,
    components: [],
    wideComponents: [],
    largeComponents: [],
    fullComponents: [],
    bigComponents: [],
    midComponents: [],
    smallComponents: [],
    lastUpdated: 0,
    activeTile: null,

    setData(data) {
        this.data = data;
        return new Promise(function (resolve, reject) {
            this.initTiles().then(() => {
                resolve();
            }).catch(e => {
                return reject(e);
            })
        }.bind(this));
    },

    getDetailForSize(size) {
        let sizeToConsider = null;
        switch (size) {
            case 'big':
                sizeToConsider = Object.create(this.bigComponents);
                break;
            case 'full':
                sizeToConsider = Object.create(this.fullComponents);
                break;
            case 'large':
                sizeToConsider = Object.create(this.largeComponents);
                break;
            case 'mid':
                sizeToConsider = Object.create(this.midComponents);
                break;
            case 'small':
                sizeToConsider = Object.create(this.smallComponents);
                break;
            case 'wide':
                sizeToConsider = Object.create(this.wideComponents);
                break;
        }
        
        if (sizeToConsider === null) {
            return false;
        }

        let toReturn = {};

        sizeToConsider.forEach(component => {
            if (component.tileType in toReturn) {
                toReturn[component.tileType]++;
            } else {
                toReturn[component.tileType] = 1;
            }
        });

        return toReturn;
    },

    getTileDetails() {
        let sizes = ['wide', 'large', 'small', 'mid', 'full', 'big'];
        let toReturn = {};
        
        for (let i=0 ; i < sizes.length ; i++) {
            toReturn[sizes[i]] = this.getDetailForSize(sizes[i]);
        }

        return toReturn;
    },

    getSizeAndCount(size) {
        switch(size) {
            case 'big':
                return this.bigComponents.length;
            case 'full':
                return this.fullComponents.length;
            case 'large':
                return this.largeComponents.length;
            case 'mid':
                return this.midComponents.length;
            case 'small':
                return this.smallComponents.length;
            case 'wide':
                return this.wideComponents.length;
        }
    },

    isDataLoaded() {
        return this.loadedData;
    },

    initTiles() {
        /**
         * If the data was refreshed before tileReload time then don't 
         * let the tile reload. The tile reload must happen after certain time.
         */

        return new Promise (function (resolve, reject) {
            let currentTime = new Date().getTime();
            if (currentTime - this.lastUpdated < (config.tileReload-1)*60*1000) {
                return reject();
            }
            this.lastUpdated = currentTime;

            //Create a copy of data to retain the data
            let data = Object.create(this.data);
            //Find specific sizeimage from Data set.
            function findSizeData(size) {
                let toSend = null;
                for (let i=0; i < data.length ; i++) {
                    if (size in data[i]) {
                        toSend = data[i];
                        data.splice(i, 1);
                        break;
                    }
                }
                if (toSend === null) {
                    return false;
                }
                return toSend;
            }

            let components = [this.largeComponents, this.fullComponents, this.wideComponents, this.smallComponents, this.bigComponents, this.midComponents];

            components.map(componentArr => {
                componentArr.map(component => {
                    if (!component.static) {
                        switch(component.ref.getTileName()) {
                            case 'BigTile':
                                component.ref.loadData(findSizeData('imgBig'));
                                break;
                            case 'FullTile':
                                component.ref.loadData(findSizeData('imgFull'));
                                break;
                            case 'LargeTile':
                                component.ref.loadData(findSizeData('imgLarge'));
                                break;
                            case 'MidTile':
                                component.ref.loadData(findSizeData('imgMid'));
                                break;
                            case 'SmallTile':
                                component.ref.loadData(findSizeData('imgSmall'));
                                break;
                            case 'WideTile':
                                component.ref.loadData(findSizeData('imgWide'));
                                break;
                        }   
                    }
                });
            });
            this.loadedData = true;
            resolve();
        }.bind(this));
    },

    registerComponent(ref) {
        if (!ref) return false;

        let found = false;
        foundComponent = this.components.filter(component => {
            if (ref.props.componentId === component.componentId) {
                found = true;
                return component;
            }
        });

        if (!found) {
            let componentToPush = {
                componentId: ref.props.componentId,
                tileType: ref.props.type,
                size: ref.getTileName(),
                static: ('static' in ref.props) ? ref.props.static : false,
                ref: ref
            };

            switch(ref.getTileName()) {
                case 'BigTile':
                    this.bigComponents.push(componentToPush);
                    break;
                case 'FullTile':
                    this.fullComponents.push(componentToPush);
                    break;
                case 'LargeTile':
                    this.largeComponents.push(componentToPush);
                    break;
                case 'MidTile':
                    this.midComponents.push(componentToPush);
                    break;
                case 'SmallTile':
                    this.smallComponents.push(componentToPush);
                    break;
                case 'WideTile':
                    this.wideComponents.push(componentToPush);
                    break;
            }
            this.components.push(componentToPush);
        }
    },

    addComponent() {
        let regenerate = false;
        let temp = -1;
        do {
            temp = Math.floor(Math.random()*139);
            regenerate = false;
            this.components.filter(component => {
                if (temp === component) {
                    regenerate = true;
                    return component;
                }
            })
        } while(regenerate)

        if (temp > 0) {
            return temp;
        } else {
            return null;
        }
    },

    unregisterAudioVideoEvents() {
        this.components.map(component => {
            component.ref.unregisterMediaEvents();
        });
    },
    buildSizeRequests(requestData, tileType) {
        let toReturn = {};
        //In big and mid
        for (let i=0; i<this.availableTileSizes.length; i++) {
            if (tileType in requestData[this.availableTileSizes[i]]) {
                toReturn[this.availableTileSizes[i]] = requestData[this.availableTileSizes[i]][tileType];
            }
        }
        return toReturn;
    },
    getContentsForTiles() {
        let tileSizes = this.getTileDetails();
        return new Promise (async function (resolve, reject) {
            let toReturn = [];
            let news_sizes = this.buildSizeRequests(tileSizes, 'news');
            let news = await NewsService.getNewsForTiles(news_sizes);
            toReturn = toReturn.concat(news);

            let xplay_videos_sizes = this.buildSizeRequests(tileSizes, 'xplay_video');
            let xplayVideo = await VideoService.getVideosForTiles(xplay_videos_sizes);
            toReturn = toReturn.concat(xplayVideo);
            resolve(toReturn);
        }.bind(this));
    }
};

export default DataManager;