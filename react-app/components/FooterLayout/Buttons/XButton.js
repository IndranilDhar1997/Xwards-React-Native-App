import React, {Component} from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import sizeCalculator from '../../../utility/tile-layouts/sizeCalculator';

export default class FooterButton extends Component {

    constructor(props) {
        super(props);
        let buttonStyle = {
            position:'relative', 
            width: sizeCalculator.width(150), 
            height: '100%', 
            alignItems: 'center', 
            borderLeftColor: '#e8e8e8', 
            borderLeftWidth: 1
        };

        if ('last' in this.props) {
            if (this.props.last) {
                buttonStyle.borderRightColor = '#e8e8e8';
                buttonStyle.borderRightWidth = 1;
            }
        }
        this.state = {
            buttonStyle : buttonStyle
        }
    }

    render() {
        return (
            <TouchableOpacity style={this.state.buttonStyle} onPress={() => this.props.click()}>
                <Image
                    style={{position: 'absolute', height: '100%', width: '100%', resizeMode: 'cover'}} 
                    source={require('./background.png')}
                />
                <Image
                    style={{height: sizeCalculator.height(40), width: '100%', resizeMode: 'contain', marginTop: sizeCalculator.height(8)}} 
                    source={this.props.icon}
                />
                <Text style={{fontSize: sizeCalculator.fontSize(23), marginTop: sizeCalculator.height(5)}}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        )
    }
}