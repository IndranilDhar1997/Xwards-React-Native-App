import React, {Fragment, Component} from 'react';
import { View, Image, Text } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import { NativeEventEmitter, NativeModules } from 'react-native'
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

const deviceInfoEmitter = new NativeEventEmitter(NativeModules.RNDeviceInfo)

export default class ConfirmModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showModal: false,
            counter: 30
        }
    }

    componentDidMount() {
        DeviceInfo.getPowerState().then(function (state) {
            if (!(state.batteryState === 'charging' || state.batteryState == 'full')) {
                this.setState({show: true, showModal: false, counter: 30});
            }
        }.bind(this));
        //Check battery status
        deviceInfoEmitter.addListener('RNDeviceInfo_powerStateDidChange', function (batteryState) {
            if (batteryState.batteryState === 'charging' || batteryState.batteryState == 'full') { //Charging
                if (this.counter) {
                    clearTimeout(this.counter);
                    this.counter = null;
                }
                this.setState({show: false, showModal: false, counter: 30});
            } else {
                this.setState({showModal: true});
                this.startCounter();
            }
        }.bind(this));
    }

    startCounter() {
        if (this.counter) {
            clearTimeout(this.counter);
            this.counter = null;
        }

        this.counter = setInterval(function() {
            let counter = this.state.counter - 1;
            if (counter>0) {
                this.setState({counter: counter});
            } else {
                clearInterval(this.counter);
                this.setState({show: true, showModal: false, counter: 30});
                this.onPowerDisconnect();
            }
        }.bind(this), 1000);
    }

    onPowerDisconnect() {
        //Close music player and show modal.
        this.props.onChargeDisconnect();
    }

  	render() {
    	return (
            <Fragment>
                {this.state.show && 
                    <View style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: 300,
                        backgroundColor: '#fff'
                    }}>
                        <Image
                            style={{width: '100%', resizeMode: 'contain', position: 'absolute', bottom: 0}}
                            source={require('../images/background/first-load-background.png')}
                        />
                        <Image style={{width: '100%', height: sizeCalculator.height(250), resizeMode: 'contain', position: 'absolute', top: sizeCalculator.height(100)}} source={require('../images/power_disconnect_car.png')} />
                        <Text style={{color: '#232b62', textAlign: 'center', fontSize: sizeCalculator.fontSize(30), top: sizeCalculator.height(400)}}>
                            PLEASE CONNECT THE POWER TO USE THE DEVICE.
                        </Text>
                    </View>
                }
                {this.state.showModal && 
                    <View style={{
                        width: '50%',
                        height: sizeCalculator.height(340),
                        backgroundColor: '#fff', 
                        position: 'absolute', 
                        top: '50%',
                        left: '25%', 
                        marginTop: sizeCalculator.height(-170), 
                        zIndex: 120,
                        alignItems: 'center',
                        borderColor: '#232b62',
                        borderWidth: sizeCalculator.convertSize(4)
                    }}>
                        <Image style={{width: '100%', height: sizeCalculator.height(160), resizeMode: 'contain', marginTop: sizeCalculator.height(20)}} source={require('../images/power_disconnect_car.png')} />
                        <Text style={{color: '#000', padding: sizeCalculator.convertSize(17), textAlign: 'center', fontSize: sizeCalculator.convertSize(22)}}>
                            Power disconnected. Please connect the power to continue. The device will stop playing media in {this.state.counter} seconds.
                        </Text>
                    </View>
                }
            </Fragment>
		);
	}
};