import React, {Fragment, Component} from 'react';
import { View } from 'react-native';

import Footer from '../components/FooterLayout/Footer';
import MainScrollView from '../components/MainScrollView';
import Logger from '../utility/Logger';

import Radio from './RadioScreen';
import News from './NewsScreen';
import Videos from './VideoScreen';
import TV from './TVScreen';
import Music from './MusicScreen';

import Reading from './internal/NewsReading';

import ConfirmModal from '../components/Modals/confirm-modal';
import PowerModal from '../components/Modals/power-modal';
import WebBrowser from '../utility/WebBrowser/index';

import {MediaPlayer, MediaManager} from '../utility/MediaPlayer';
import VideoService from '../service/VideoService';

import sizeCalculator from '../utility/tile-layouts/sizeCalculator';

import config from '../utility/config';
import AutoVideoAds from '../components/Modals/auto-video-ads';

import CameraService from '../service/CameraService';

export default class MainScreen extends Logger {

	constructor(props) {
		super(props);
		this.state = {
			routeName: this.props.navigation.state.routeName,
			screen: null, //<MainScrollView />,
			showConfirm: false,
			confirmModalRef: null
		}
	}
	
	renderPage(screenName, data) {
		let screenToMount = null;
		switch(screenName) {
			case 'MainScreen':
				//screenToMount = <MainScrollView />;
				this.refWebBrowser.close();
				screenToMount = null;
				break;
			case 'Radio':
				this.refWebBrowser.close();
				screenToMount = <Radio pageRouting={(pageName) => this.renderPage(pageName)} />;
				break;
			case 'News':
				this.refWebBrowser.close();
				screenToMount = <News pageRouting={(pageName, data) => this.renderPage(pageName, data)} />;
				break;
			case 'ReadingSection':
				screenToMount = <Reading pageRouting={(pageName) => this.renderPage(pageName)} data={data} />;
				break;
			case 'Videos':
				this.refWebBrowser.close();
				screenToMount = <Videos pageRouting={(pageName) => this.renderPage(pageName)} channelId={data} />;
				break;
			case 'TV':
				this.refWebBrowser.close();
				screenToMount = <TV pageRouting={(pageName) => this.renderPage(pageName)} />;
				break;
			case 'Music':
				this.refWebBrowser.close();
				screenToMount = <Music pageRouting={(pageName) => this.renderPage(pageName)} />;
				break;
			case 'WebAds':
				this.refWebBrowser.loadWebsite(data.url);
				break;
		}
		
		let Logging = {
            type: 'Navigation',
            page: screenName,
            data: data
		};
		
        this.logAction(Logging);
		this.setState({routeName: screenName, screen: screenToMount});
	}

	endAll() {
		this.renderPage('MainScreen');
		VideoService.syncContents().then(() => {
			VideoService.prepareContents();
		})
	}
	
	componentDidUpdate() {
		if (this.confirmModalRef) {
			this.confirmModalRef.resetSeekForInactivity();
		}
		if (this.refAutoVideoAds) {
			this.refAutoVideoAds.markActive();
		}
	}

	markActive() {
		this.confirmModalRef.resetSeekForInactivity();
		this.refAutoVideoAds.markActive();
	}

	onPowerDisconnection() {
		if (MediaManager.getMedia() !== null) {
			MediaManager.stopMedia();
		}
	}

	playAutoAds() {
		console.log(this.cameraServiceRef);
		if(this.cameraServiceRef) {
			console.log('Am here');
		}
	}

  	render() {
    	return (
			<Fragment>
				<CameraService ref={(ref)=> {this.cameraServiceRef = ref}} />
				<View style={{flexDirection: 'column', height: sizeCalculator.height(690)}}>
					{this.state.screen !== null && this.state.screen}
					<MainScrollView pageRouting={(pageName, data) => this.renderPage(pageName, data)} />
                </View>
				<Footer navigation={this.props.navigation} pageRouting={(pageName) => this.renderPage(pageName)} />
				
				{/** Confirm Modal Asks if the user is using the tablet. Only when someone is playing somehting or is not on Main Screen */}
				<ConfirmModal ref={(ref) => {this.confirmModalRef = ref}} onExit={() => this.endAll()} screen={this.state.routeName} />
				
				{/** The Media Player */}
				<MediaPlayer onPlaying={() => this.markActive()} onStop={() => this.markActive()} onClose={() => this.markActive()} />
				
				{/** The Modal which shows the tablet must be charging */}
				{!config.isDemo && <PowerModal onChargeDisconnect={() => this.onPowerDisconnection()} />}
				
				{/** The Webview of the tablet to open websites. */}
				<WebBrowser ref={(ref) => {this.refWebBrowser = ref}}/>

				{/** If someone is not using the tablerefWebBrowsert and the tablet is on MainScreen the AutoAds comes up. */}
				<AutoVideoAds screen={this.state.routeName} ref={(ref) => {this.refAutoVideoAds = ref}} camera = {() => this.cameraServiceRef } />
			</Fragment>
		);
	}
};