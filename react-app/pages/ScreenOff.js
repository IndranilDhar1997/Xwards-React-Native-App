import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {MediaManager} from '../utility/MediaPlayer';
import LoggerService from '../service/LoggingService';
import config from '../utility/config';
import sizeCalculator from '../utility/tile-layouts/sizeCalculator';

export default class ScreenOff extends Component {

    constructor(props) {
        super(props);
        
        MediaManager.stopMedia('Video');
        MediaManager.stopMedia('TV');

        LoggerService.log({
            type: 'Settings',
            action: 'SCREEN_OFF'
        });

        this.goBack = setTimeout(function() {
            this.props.navigation.navigate('MainScreen');
        }.bind(this), config.screenTurnOnTime*1000*60);
    }

    screenOn() {
        LoggerService.log({
            type: 'Settings',
            action: 'SCREEN_ON'
        });
        this.goBack = null;
        this.props.navigation.navigate('MainScreen');
    }

  	render() {
    	return (
            <View style={{backgroundColor: 'black', width: '100%', height: '100%'}}>
                <TouchableOpacity 
                    style={{position:'relative', height: '100%', width:'100%', alignItems: 'center', alignContent: 'center'}} 
                    onPress={() => this.screenOn()}>
                    <Text style={{color: '#383838', fontSize: sizeCalculator.fontSize(30), width: '100%', height: '100%', textAlign: "center", textAlignVertical: 'center'}}>
                        SCREEN IS TURNED OFF. TAP TO RESUME.
                    </Text>
                </TouchableOpacity>
            </View>
		);
	}
};