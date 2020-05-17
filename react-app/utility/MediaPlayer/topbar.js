import React, {Component} from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import sizeCalculator from '../tile-layouts/sizeCalculator';

export default class TopBar extends Component {
    render() {
        return (
            <View style={{flex: 1, flexDirection: 'row', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <View style={{flex: 1, width: '50%'}}>
                    <Image source={require('./images/logo.png')} 
                        style={{width: sizeCalculator.width(130),
                                height: sizeCalculator.height(25), 
                                resizeMode: 'contain', 
                                marginTop: sizeCalculator.height(9), 
                                alignSelf: 'flex-start',
                                marginLeft: sizeCalculator.width(20)}} />
                </View>
                <View style={{flex: 1, width: '50%'}}>
                    <TouchableOpacity onPress={() => this.stopMedia()}>
                        <Image source={require('./images/close-btn.png')} 
                            style={{width: sizeCalculator.width(20), 
                                height: sizeCalculator.height(20), 
                                resizeMode: 'contain', 
                                alignSelf: 'flex-end', 
                                marginTop: sizeCalculator.height(6),
                                marginRight: sizeCalculator.width(13)}} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}