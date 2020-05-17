import React, {Fragment, Component} from 'react';
import { Image, View, TouchableOpacity, Animated, Text } from 'react-native';
import sizeCalculator from '../tile-layouts/sizeCalculator';

const utilityFunctions = {
    toDoubleDigit(number) {
        return ("0" + number).slice(-2);
    },
    secondsToHms: function(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var displayTime = (h > 0) ? this.toDoubleDigit(h)+":" : "";
        displayTime += (m > 0) ? this.toDoubleDigit(m)+":" : "00:";
        displayTime += (s > 0) ? this.toDoubleDigit(s) : ((m > 0) ? this.toDoubleDigit(s) : ((h > 0) ? this.toDoubleDigit(s) : ""));
        return displayTime;
    },
}

export default class VideoTimer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            seekingTo: null,
            totalDuration: null,
            fullScreenMode: false,
            style : {
                width: '30%',
                zIndex: 13,
                position:'absolute',
                bottom: sizeCalculator.height(15),
                color: 'white',
                fontSize: sizeCalculator.fontSize(16),
                marginLeft: sizeCalculator.width(12),
            }
        };
    }

    disableFullScreenMode() {
        this.setState({
            style : {
                width: '30%',
                zIndex: 13,
                position:'absolute',
                bottom: sizeCalculator.height(15),
                color: 'white',
                fontSize: sizeCalculator.fontSize(16),
                marginLeft: sizeCalculator.width(12),
            }, fullScreenMode: false
        });
    }

    enableFullScreenMode() {
        this.setState({fullScreenMode: true});
        this.fullScreenModeControlsShow(true);
    }

    fullScreenModeControlsShow(force) {
        force = force || null;
        if (!force) {
            if (!this.state.fullScreenMode) {
                //if not fullscreen then don't execute
                return false;
            }
        }

        this.setState({
            style : {
                width: '30%',
                zIndex: 13,
                position:'absolute',
                bottom: sizeCalculator.height(117),
                color: 'white',
                fontSize: sizeCalculator.fontSize(16),
                marginLeft: sizeCalculator.width(192),
            }
        });
    }

    fullScreenModeControlsHidden() {
        if (!this.state.fullScreenMode) {
            //if not fullscreen then don't execute
            return false;
        }

        this.setState({
            style : {
                width: '30%',
                zIndex: 13,
                position:'absolute',
                bottom: sizeCalculator.height(55),
                color: 'white',
                fontSize: sizeCalculator.fontSize(16),
                marginLeft: sizeCalculator.width(192),
            }
        });
    }

    setTotalDuration (totalDuration) {
        this.setState({totalDuration});
    }

    setSeek(seekingTo) {
        this.setState({seekingTo});
    }

    render() {
        return(
            <Fragment>
                <Text style={this.state.style}>
                    {(this.state.seekingTo !== null) && 
                        utilityFunctions.secondsToHms(this.state.seekingTo) + " / " + utilityFunctions.secondsToHms(this.state.totalDuration)
                    }
                </Text>
            </Fragment>
        )
    }
}