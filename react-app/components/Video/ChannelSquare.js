import React, {Component} from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class ChannelSquare extends Component {

  	render() {
    	return (
            <TouchableOpacity onPress={this.props.onClick} style={{ 
                width: sizeCalculator.width(175), height: sizeCalculator.height(175), marginLeft: sizeCalculator.width(15), marginBottom: sizeCalculator.height(15), borderRadius: 0, backgroundColor: 'white', marginRight: sizeCalculator.width(15)}}>
                <React.Fragment>
                    <Image
                        style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                        source={{uri: this.props.icon}}
                    />
                    <Text style={{
                        position: 'absolute',
                        fontWeight: '100', 
                        fontFamily: 'Montserrat-Light',
                        textAlign: 'left',
                        fontSize: sizeCalculator.fontSize(13),
                        textAlignVertical: 'center', 
                        color: '#fff', backgroundColor: '#0350a4', paddingTop: sizeCalculator.height(5),
                        padding: sizeCalculator.convertSize(8),
                        bottom: sizeCalculator.height(10),
                        right: sizeCalculator.width(10)
                    }}>
                        Video List
                    </Text>
                </React.Fragment>
            </TouchableOpacity>
		);
	}
};