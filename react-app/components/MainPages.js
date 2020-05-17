import React, {Component} from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native';
import sizeCalculator from '../utility/tile-layouts/sizeCalculator';

export default class MainPage extends Component {

    constructor(props) {
        super(props);
        let stateToUpdate = {};
        switch (this.props.theme) {
            case "light":
                stateToUpdate.backButton = require('../components/images/icons/back-arrow-dark.png');
                stateToUpdate.fontColor = '#000';
                break;
            case "dark":
            default:
                stateToUpdate.backButton = require('../components/images/icons/back-arrow.png');
                stateToUpdate.fontColor = '#fff';
                break;
        }
        if ('noScroll' in this.props) {
            if (this.props.noScroll) {
                stateToUpdate.scroll = false;
            } else {
                stateToUpdate.scroll = true;
            }
        } else {
            stateToUpdate.scroll = true;
        }
        this.state = stateToUpdate;
    }

    render() {
        return (
            <View style={{height: sizeCalculator.height(690), flexDirection: 'column', position: 'relative'}}>
                <Image
                    style={{height: '100%', width: '100%', resizeMode: 'cover', position: 'absolute', top: 0, right: 0}} 
                    source={this.props.background}
                />
                <View style={{height: sizeCalculator.height(690), flexDirection: 'column', position: 'relative', paddingLeft: sizeCalculator.width(10), paddingRight: sizeCalculator.width(10)}}>
                    <View style={{height: sizeCalculator.height(60), width: '100%', marginTop: sizeCalculator.height(10), flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.props.backScreen} style={{position:'relative', height: '100%', width: sizeCalculator.width(70), alignItems: 'center', alignContent: 'center'}} >
                            <Image
                                style={{height: sizeCalculator.height(30), width: '100%', resizeMode: 'contain', alignSelf: 'center', marginTop:sizeCalculator.height(16)}} 
                                source={this.state.backButton}
                            />
                        </TouchableOpacity>
                        <Text style={{fontSize: sizeCalculator.fontSize(30), textAlignVertical: 'center', color: this.state.fontColor, marginLeft: sizeCalculator.width(10)}}>
                            {this.props.title}
                        </Text>
                    </View>
                    {this.state.scroll && 
                        <ScrollView style={{width: '100%', marginBottom:sizeCalculator.height(10), marginTop:sizeCalculator.height(10)}} showsVerticalScrollIndicator={false}>
                            {this.props.children}
                        </ScrollView>
                    }
                    {(!this.state.scroll) && 
                        this.props.children
                    }
                </View> 
            </View>
        );
    }
}