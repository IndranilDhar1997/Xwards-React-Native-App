// import packageJson from '../../package.json';
import React, {Fragment, Component} from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';

import LoggerService from '../service/LoggingService';
import LocalStorage from '../service/LocalStorage';

import NumericKeyboard from '../utility/ui/numeric-keyboard';

import QRCode from 'react-native-qrcode';
import DeviceInfo from 'react-native-device-info';

import config from '../utility/config';

import Axios from 'axios';

import { StackActions, NavigationActions } from 'react-navigation';

import sizeCalculator from '../utility/tile-layouts/sizeCalculator';
import ExitModal from '../components/Modals/exit-confirmModal';

const maxOTPLength = 4;

export default class RegisterDevice extends Component {

    constructor(props) {
        super(props);

        this.state = {
            otp: '',
            otpToView: '',
            androidId: null,
            error: false
        }
        this.typeInterval = null;
    }

    pingServer() {
        DeviceInfo.getAndroidId().then(function (androidId) {
            let that = this;
            let pingServerUrl = config.routes.registerPage.pingServerURL(androidId);
            Axios.get(pingServerUrl).then(function (res) {
                if (that.pingServerInterval) {
                    clearInterval(that.pingServerInterval);
                    that.pingServerInterval=null;
                }
                LoggerService.setServerDeviceID(res.data.id);
                that.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
                }));
            }.bind(that)).catch(function (e) {
                console.log('Error while fetching record from the server.', e);
            }.bind(that));
        }.bind(this)).catch(e => {
            console.log('Cannot fetch the device information', e);
        });
    }

    componentDidMount() {
        //Fetching the information from server.
        DeviceInfo.getAndroidId().then(function (androidId) {
            this.setState({androidId: androidId}); //Set the android id for the QR Code.
            LoggerService.setDeviceId(androidId); //Set the Android Id in Logger Service.
        }.bind(this));

        LocalStorage.get('ServerDeviceId', function(data) { //Look for Device Server Id in the system.
            if (data && data.deviceId) { //If the device id is here go to main screen.
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
                }));
            } else {
                let _this = this;
                this.pingServerInterval = setInterval(function() {
                    _this.pingServer();
                }.bind(_this), 1500);
            }
        }.bind(this));
    }

    digit(e) {
        clearInterval(this.typeInterval);
        let str = '';
        for (let i=0; i<e.length-1; i++) {
            str += '*';
        }
        if (e.length > 0) {
            str += e.substr(e.length-1,1);
        }
        this.setState({otp: e, otpToView: str, error: false});

        this.typeInterval = setInterval(function() {
            let str = '';
            for (let i=0; i<this.state.otpToView.length; i++) {
                str += '*';
            }
            this.setState({otpToView: str});
        }.bind(this), 500);
    }
    submitOTP(d) {
        clearInterval(this.typeInterval);

        var deviceId = this.state.androidId;
        var appVersion = config.appVersion;
        let submitOTPUrl = config.routes.registerPage.submitOTP();
        Axios({
            method: 'post',
            url: submitOTPUrl,
            data: {
                deviceId: deviceId,
                otp: d,
                appVersionId: appVersion
            }
        }).then(e => {
            LoggerService.setServerDeviceID(e.data.id);
            this.props.navigation.navigate('MainScreen');
        }).catch(e => {
            this.setState({error: true});
        });
    }

  	render() {
    	return (
            <Fragment>
                {(this.state && this.state.androidId) && 
                    <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100}}>
                        <View style={{position: 'absolute', top: sizeCalculator.height(230), left: sizeCalculator.width(230), zIndex: 90}}>
                            <TouchableWithoutFeedback onLongPress={()=>this.exitModalRef.showDialog()}>
                                <QRCode
                                    value={this.state.androidId}
                                    size={sizeCalculator.width(300)}
                                    bgColor='#232b62'
                                    fgColor='white'
                                />
                            </TouchableWithoutFeedback>
                        </View>
                        <Image
                            style={{width: '100%', height: '30%', position: 'absolute', bottom: 0, justifyContent: 'space-evenly', overflow: 'hidden'}}
                            source={require('../components/images/background/first-load-background.png')}
                            resizeMode="cover"
                            resizeMethod="resize"
                        />
                        <Image
                            style={{width: sizeCalculator.width(300), height: sizeCalculator.height(120), 
                                resizeMode: 'contain', marginTop: sizeCalculator.height(50), marginLeft: sizeCalculator.width(230), position: 'absolute'}}
                            source={require('../components/FooterLayout/xds.png')}
                        />
                        <Text style={{fontSize: 20, width: sizeCalculator.width(300), 
                            position: 'absolute', color: '#000', textAlign: 'center', 
                            marginTop: sizeCalculator.height(170), marginLeft: sizeCalculator.width(230)}}>
                            DEVICE REGISTRATION
                        </Text>
                        <View style={{height: sizeCalculator.height(120), backgroundColor: '#f3f3f3', width: sizeCalculator.width(300), position: 'absolute', top: sizeCalculator.height(50), right: sizeCalculator.width(230)}}>
                            <Text style={{width: '100%', paddingLeft: sizeCalculator.width(10), paddingRight: sizeCalculator.width(10), paddingVertical: sizeCalculator.height(20), fontSize: sizeCalculator.fontSize(33), letterSpacing: sizeCalculator.width(10), color: 'black', textAlign: 'center'}}>
                                {this.state.otpToView}
                            </Text>
                            {this.state.error && 
                                <Text style={{fontSize: sizeCalculator.fontSize(20), width: sizeCalculator.width(300), position: 'absolute', color: '#d33', textAlign: 'center', marginTop: sizeCalculator.height(130)}}>
                                    Incorrect OTP
                                </Text>
                            }
                        </View>
                        <NumericKeyboard 
                            minLength={maxOTPLength} 
                            maxLength={maxOTPLength} 
                            style={{position: 'absolute', top: sizeCalculator.height(230), right: sizeCalculator.width(230), height: sizeCalculator.height(310), width: sizeCalculator.width(300)}} 
                            onUpdate={(d) => this.digit(d)}
                            onSubmit={(d) => this.submitOTP(d)} />
                    </View>
                }
                <ExitModal ref={(ref) => {this.exitModalRef = ref}} />
            </Fragment>
		);
	}
};