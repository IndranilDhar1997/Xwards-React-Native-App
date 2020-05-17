import React, {Component} from 'react';
import { View } from 'react-native';

export default class XRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: this.props.height
        };
    }

    render() {
        return (
            <View style={{flexDirection: 'row', height: this.state.height, width: '100%'}}>
                {this.props.children}
            </View>
        )
    }
}