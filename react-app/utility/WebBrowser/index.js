import React, {Fragment, Component} from 'react';
import {View, TouchableOpacity, Text, ScrollView, Image, Keyboard } from 'react-native';
import config from '../../utility/config';
import { WebView } from 'react-native-webview';
import sizeCalculator from '../tile-layouts/sizeCalculator';
import InternetService from '../../service/InternetService';

export default class WebBrowser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUrl: null,
            webStack: []
        }
    }

    loadWebsite(url) {
        // this.setState({currentUrl: url});
        if(InternetService.isConnected()) {
            this.setState({currentUrl: url});
        } else {
            this.setState({currentUrl: null});
        }
    } 

    onNavigationStateChange(navigator) {
        if (navigator.url.indexOf(this.state.currentUrl) === 0) {
            let stack = this.state.webStack;
            stack.push(navigator.url);
            this.setState({webStack: stack});
            return true;
        } else {
            this.webviewRef.stopLoading(); //Some reference to your WebView to make it stop loading that URL
            return false;
        }
    }

    goBack() {
        this.webviewRef.goBack();
    }

    goForward() {
        this.webviewRef.goForward();
    }

    close() {
        this.setState({
            currentUrl: null,
            webStack: [],
            whitelist: null
        });
    }

    render() {
        return (
            <Fragment>
                {this.state.currentUrl !== null && 
                    <View style={{position: 'absolute', zIndex: 45, height: sizeCalculator.height(690), width: sizeCalculator.getDeviceWidth()}}>
                        <WebView
                            keyboardDisplayRequiresUserAction={false}
                            hideKeyboardAccessoryView={true}
                            allowFileAccess={true}
                            originWhitelist={['*']}
                            startInLoadingState={true}
                            ref={(ref) => {this.webviewRef=ref}}
                            scalesPageToFit={false}
                            source={{uri: this.state.currentUrl}} 
                            style={{width: '100%', height: sizeCalculator.height(756)}} 
                            injectJavaScript={true}
                            automaticallyAdjustContentInsets={false}
                            javaScriptEnabled={true}
                            onNavigationStateChange={(nav) => this.onNavigationStateChange(nav)}
                        />
                    </View>
                }
            </Fragment>
        );
    }
}