import React, {Fragment, Component} from 'react';
import { ScrollView, View } from 'react-native';

import LoggerService from '../service/LoggingService';
import DeviceInfo from 'react-native-device-info';

import Layouts from './MainLayouts/Layouts';

import DataManager from '../service/DataManagerService';
import ExitModal from './Modals/exit-confirmModal';

import RNRestart from 'react-native-restart';

import config from '../utility/config';
import ForceStop from '../native-module/ForceStop';

import sizeCalculator from '../utility/tile-layouts/sizeCalculator';
import LoadingPage from '../pages/LoadingPage';
import DataSyncService from '../service/DataSyncService';

import DownloadManager from '../native-module/DownloadManager';
import AdsManager from '../service/AdsManager';

import { firebase } from '@react-native-firebase/crashlytics';


export default class MainScrollView extends Component {
    
    //Constructor function
    constructor(props) {
        super(props);
        this.state = {
            screens: Layouts,
            dataLoaded: false,
        }
        this.pageNumber = 1;
        LoggerService.watchPosition();
    }

    componentDidMount() {
        this.currentScroll = 0;
        this.screenSize = sizeCalculator.width(1280);
        this.screenCounts = Layouts.length;

        this.enableAutoScroll();
        this.loadData();

        this.contentReload = setInterval(function() {
            this.loadData();
            DeviceInfo.getBatteryLevel().then(batterLevel => {
                LoggerService.log({
                    type: 'Info',
                    action: 'BATTERY_LEVEL',
                    data: parseInt(batterLevel*100)
                })
            });
        }.bind(this), (config.tileReload)*60*1000);
    }

    componentWillUnmount () {
        clearInterval(this.autoScroller);
        clearInterval(this.contentReload);
        console.log('Unmounting MainScroll View, will reload the app.');
        firebase.crashlytics().setAttributes({unmounted: 'root'});
		firebase.crashlytics().log('Main Scroll View component was unmounted.');
		firebase.crashlytics().recordError(new Error('Component unmounted.'));
		ForceStop.restart();
    }
    
    loadData() {
        DataManager.getContentsForTiles().then(function (tileContents) {
            let _this = this;
            DataManager.setData(tileContents).then(function () {
                _this.setState({dataLoaded: true});
            }.bind(_this))
        }.bind(this));

        //For Downloading the Video Ads
        AdsManager.fetchVideoAd().then(()=> {
           //For Downloading the Contents
            DataSyncService.init().then(() => {
                DownloadManager.startService();
            })
        })
    }

    enableAutoScroll() {
        //Auto Scroller
        if (!this.currentScroll) {
            this.currentScroll = 0;
        }

        this.autoScroller = setInterval(function() {
            let scrollTo = this.currentScroll + this.screenSize;
            if (scrollTo >= (this.screenSize * this.screenCounts)) {
                scrollTo = 0;
            }
            this.mainScroller.scrollTo({x: scrollTo, animated: true, duration: 3000});
            //this.setState({currentScroll: scrollTo});
            this.currentScroll = scrollTo;
        }.bind(this), config.autoScrollTime);
    }

    disableAutoScroll() {
        if (this.autoScroller) {
            clearInterval(this.autoScroller);
            this.autoScroller = null;
        }
    }

    restartAutoScroll(pos) {
        position = pos.nativeEvent.contentOffset.x+1280;
        let pageNumber =  Math.round(parseFloat(position/1280));
        pageNumber = pageNumber-1;
        let scrollTo = pageNumber*1280;
        //this.setState({currentScroll: scrollTo});
        this.currentScroll = scrollTo;

        setTimeout(function() {
            if (!this.autoScroller) {
                this.enableAutoScroll();
            }
        }.bind(this), config.autoScrollRestartAfterTouch)
    }

    toPage(data) {
        this.props.pageRouting(data.pageName, data.data);
    }

    render() {
        return (
            <Fragment>
                <View style={{height: '100%', flexDirection: 'row', zIndex: 2}}>
                    <ScrollView ref={(ref) => { this.mainScroller = ref }}
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        // onScroll={(pos) => this.handleScroll(pos)}
                        onScrollBeginDrag={() => this.disableAutoScroll()}
                        onScrollEndDrag={(pos) => this.restartAutoScroll(pos)}
                        >
                            {Layouts.map((screen) => {
                                return React.cloneElement(screen, {route: ((data) => this.toPage(data)) } );
                            })}
                    </ScrollView>
                </View>
                {(!this.state.dataLoaded) && 
                    <LoadingPage />
                }
                <ExitModal ref={(ref) => {this.exitModalRef = ref}} />
            </Fragment>
        );
    }
}