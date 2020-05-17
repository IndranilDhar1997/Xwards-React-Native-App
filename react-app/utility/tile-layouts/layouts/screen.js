import React, {Component} from 'react';
import { View,Image } from 'react-native';

import sizeCalculator from '../sizeCalculator';

export default class Screen extends Component {

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'row', height:'100%', width: sizeCalculator.width(1280), paddingTop: sizeCalculator.height(2), paddingBottom: sizeCalculator.height(2), zIndex: 1}}>
                {this.props.children}
            </View>
        )
    }
}