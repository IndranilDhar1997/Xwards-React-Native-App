import React, {Component} from 'react';
import { Text, Dimensions, PermissionsAndroid } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MainScreen from './pages/MainScreen';
import ScreenOff from './pages/ScreenOff';
import RegisterDevice from './pages/RegisterDevice';

import LoggerService from './service/LoggingService';
import sizeCalculator from './utility/tile-layouts/sizeCalculator';

import Database from './service/DatabaseService';

import NewsService from './service/NewsService';
import VideoService from './service/VideoService';
import DataSyncService from './service/DataSyncService';

import TrackPlayer from "react-native-track-player";

import LoadingPage from './pages/LoadingPage';
import PermissionsPage from './pages/Permissions';

import KioskMode from './native-module/KioskMode';
import ForceStop from './native-module/ForceStop';
import Config from './utility/config';

import { firebase } from '@react-native-firebase/crashlytics';

const Navigator = createStackNavigator({
  	MainScreen: {screen: MainScreen},
	ScreenOff: {screen: ScreenOff},
	RegisterDevice: {screen: RegisterDevice}
},{
    initialRouteName: 'RegisterDevice',
    defaultNavigationOptions: {
        header: null
    }
});

const AppContainer = createAppContainer(Navigator);

class Root extends Component {	
	constructor(props) {
		super(props);

		this.state = {
			renderer: <LoadingPage />,
			showDialog: false
		}
		//Enable Logger Service
		LoggerService.init()
		//Notifies App for the Current Window Size
		sizeCalculator.init(Dimensions.get('window').width, Dimensions.get('window').height);
	}

	componentDidMount() {
		this.checkPermissions().then(function() {
			if (!Config.isDemo) {
				KioskMode.startLockTask();
			}
			TrackPlayer.setupPlayer(); //Audio Player
			TrackPlayer.updateOptions({
				stopWithApp: true,
				capabilities: [
					TrackPlayer.CAPABILITY_PLAY,
					TrackPlayer.CAPABILITY_PAUSE,
					TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
					TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
					TrackPlayer.CAPABILITY_STOP
				],
				compactCapabilities: [
					TrackPlayer.CAPABILITY_PLAY,
					TrackPlayer.CAPABILITY_PAUSE
				]
			});
			TrackPlayer.setVolume(0.7);
			
			DataSyncService.clearDownloadDirectory().then(function () {
				this.initApp();
			}.bind(this)).catch(function (e) {
				this.setState({renderer: <Text>Unable to delete contents from Download Directory.</Text>});
			}.bind(this));
		}.bind(this)).catch(function() {
			console.log('Required Permissions Not Given');
			this.setState({renderer: <PermissionsPage />});
		}.bind(this))

	}

	componentWillUnmount() {
		firebase.crashlytics().setAttributes({unmounted: 'root'});
		firebase.crashlytics().log('Root component was unmounted.');
		firebase.crashlytics().recordError(new Error('Component unmounted.'));
		ForceStop.restart();
	}

	initApp() {
		//Create Database if not exist and check if database is ready
		Database.initDB().then(function() {
			var _this = this;
			Database.initTables().then(async function() { //Create table and proceed
				Database.run(`DELETE FROM download_manager where 1=1`).then(async function() {
					await NewsService.fetchNews();
					NewsService.getNews();
					await VideoService.syncContents(); //Read Local Dirctory and Populate Database Table
					VideoService.prepareContents(); //Prepare Channel for instant render
					_this.setState({
						renderer: <AppContainer />
					});
				})
			}.bind(_this));
		}.bind(this)).catch(err => {
			this.setState({
				renderer: <Text>App is not ready. It crashed.</Text>
			})
		});
	}

	checkPermissions() {
		return new Promise(function(resolve, reject) {
			PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION').then(function (bool) {
				if (!bool) {
					return reject();
				}
				PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE').then(function (bool) {
					if (!bool) {
						return reject();
					}
					PermissionsAndroid.check('android.permission.READ_EXTERNAL_STORAGE').then(function (bool) {
						if (!bool) {
							return reject();
						}
						return resolve();	
					});	
				});
			});
		})
	}

    render() {
		return (
			this.state.renderer	
		);
    }
};

export default Root;