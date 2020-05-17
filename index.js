import {AppRegistry} from 'react-native';
import Root from './react-app/Root';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import DownloadManagerHeadless from './DownloadManagerHeadless';

//Main App
AppRegistry.registerComponent(appName, () => Root);
//Adding Headless Component
AppRegistry.registerHeadlessTask('DownloadManager', () => DownloadManagerHeadless);
//Track Player Registry
TrackPlayer.registerPlaybackService(() => require('./player-service'));