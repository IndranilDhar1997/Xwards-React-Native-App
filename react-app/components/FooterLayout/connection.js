import React, {Component, Fragment} from 'react';
import { Text, View } from 'react-native';
import LoggerService from '../../service/LoggingService';

import NetInfo from "@react-native-community/netinfo";
import InternetService from '../../service/InternetService';

import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class Connection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notConnected: false
        }
    }

    componentDidMount() {
        NetInfo.addEventListener(function (netStat) {
            this.setState({notConnected: !netStat.isConnected});

            InternetService.updateConnection(netStat.isConnected);    //Update if connection is established or not.
            
            LoggerService.log({
                type: 'Info',
                action: 'INTERNET_CONNECTION',
                data: (netStat.isConnected) ? 'CONNECTED':'NOT_CONNECTED'
            });
        }.bind(this));
    }

  	render() {
    	return (
            <Fragment>
                {this.state.notConnected && 
                    <View style={{position: 'absolute', width: '100%', height: sizeCalculator.height(44), padding: 5, backgroundColor: '#DE3C4B', zIndex: 20, bottom: sizeCalculator.height(110)}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(17), color: '#FFF', textAlign: 'center', fontWeight: 'bold'}}>... Internet Connection Lost ...</Text>
                    </View>
                }
            </Fragment>
		);
	}
};