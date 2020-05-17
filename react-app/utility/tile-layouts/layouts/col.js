import React, {Component} from 'react';
import { View } from 'react-native';

import sizeCalculator from '../sizeCalculator';

export default class XColumn extends Component {

    constructor(props) {
        super(props);
        let width = sizeCalculator.width(33.33*this.props.span);
        this.state = {
            width: width,
            height: this.props.height
        };
    }

    render() {
        return (
            <View style={{flex: this.props.span, flexDirection: 'column', height: this.state.height, width: this.state.width}}>
                {this.props.children}
            </View>
        )
    }
}