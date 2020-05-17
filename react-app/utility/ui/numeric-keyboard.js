import React, {Component, Fragment} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import sizeCalculator from '../tile-layouts/sizeCalculator';

export default class NumericKeyboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            maxLength: this.props.maxLength || null,
            minLength: this.props.minLength || null
        }
    }

    onPressDigit(d) {
        let number = this.state.number;
        if (d === 'bksp') {
            if (number.length > 0) {
                number = number.substr(0, number.length-1);
            }
            d='';
        }
        if (d === 'ent') {
            if (this.state.minLength && number.length < this.state.minLength) {
                return false;
            }
            if (this.state.maxLength && number.length > this.state.maxLength) {
                return false;
            }
            this.props.onSubmit(number);
            return;
        }
        if (this.state.maxLength) {
            if (number.length < this.state.maxLength) {
                number += d;
                this.setState({number: number});
            }
        } else {
            number += d;
            this.setState({number: number});
        }
        this.props.onUpdate(number);
    }

    render() {
        return (
            <View style={{...this.props.style, flex: 1, flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', height: '25%', width: '100%'}}>
                    <TouchableOpacity onPress={() => this.onPressDigit('1')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('2')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('3')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>3</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', height: '25%', width: '100%'}}>
                    <TouchableOpacity onPress={() => this.onPressDigit('4')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('5')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('6')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>6</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', height: '25%', width: '100%'}}>
                    <TouchableOpacity onPress={() => this.onPressDigit('7')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('8')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('9')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>9</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', height: '25%', width: '100%'}}>
                    <TouchableOpacity onPress={() => this.onPressDigit('bksp')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10, alignContent: 'center'}}>
                        <Image style={{width: '100%', height: sizeCalculator.height(20), resizeMode: 'contain', marginTop: sizeCalculator.height(13)}} source={require('./bksp.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('0')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10}}>
                        <Text style={{fontSize: sizeCalculator.fontSize(27), width: '100%', textAlign: 'center', height: '100%'}}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDigit('ent')} style={{flex: 1, zIndex: 99, width: '33.3%', borderWidth: 1, borderColor: '#e4e4e4', height: '100%', backgroundColor: '#f3f3f3', padding: 10, alignContent: 'center'}}>
                        <Image style={{width: '100%', height: sizeCalculator.height(20), resizeMode: 'contain', marginTop: sizeCalculator.height(13)}} source={require('./ent.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}