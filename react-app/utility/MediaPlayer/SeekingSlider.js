import React, {Fragment, Component} from 'react';
import { Image, View, TouchableOpacity, Animated, Text } from 'react-native';
import config from '../config';
import Slider from 'react-native-slider';
import sizeCalculator from '../tile-layouts/sizeCalculator';

export default class SeekingSlider extends Component {

    constructor(props) {
        super(props);

        this.state= {
            seekingTo: 0,
            totalDuration: this.props.totalDuration,
            seekingFactor: 100,
            style: {
                width: '100%',
                height: sizeCalculator.height(10),
                marginBottom: sizeCalculator.height(10)
            }
        }
    }

    updateSlidingPosition(position) {
        this.setState({seekingTo: position})
    }

    updateDuration(totalDuration) {
        if (totalDuration < 0) {
            totalDuration = 0;
        }
        this.setState({totalDuration: totalDuration, seekingTo: 0})
    }

    pullUp() {
        if (!this.props.fullScreen) {
            return false;
        }
        this.setState({style : {width: '70%', height: sizeCalculator.height(10), marginBottom: sizeCalculator.height(72), position: 'absolute', bottom: sizeCalculator.height(30), zIndex: 70}});
    }
    pullDown() {
        if (!this.props.fullScreen) {
            return false;
        }
        this.setState({style : {width: '70%', height: sizeCalculator.height(10), marginBottom: sizeCalculator.height(10), position: 'absolute', bottom: sizeCalculator.height(30), zIndex: 70}});
    }

    toggleForFullScreen(value) {
        if (value) {
            this.setState({style : {width: '70%', height: sizeCalculator.height(10), marginBottom: sizeCalculator.height(72), position: 'absolute', bottom: sizeCalculator.height(30), zIndex: 70}, seekingFactor: 70 })
        } else {
            this.setState({style : {width: '100%', height: sizeCalculator.height(10), marginBottom: sizeCalculator.height(10), position: 'relative'}, seekingFactor: 100 })
        }
    }

    onClickSlider(seek) {
        let seekingPercentage = ((seek/((this.props.width*this.state.seekingFactor)/100))*100);
        let seekTo = (this.state.totalDuration*(seekingPercentage/100));
        this.setState({seekingTo: seekTo});

        if ('onClickOnSlider' in this.props) {
            this.props.onClickOnSlider(seekTo);
        }
    }

    render() {
        return(
            <Fragment>
                {!this.props.disabled && 
                    <Slider
                        ref={(ref) => {this.slider = ref}}
                        onTouchStart={(e) => this.onClickSlider(e.nativeEvent.locationX)} 
                        style={this.state.style}
                        value={this.state.seekingTo}
                        trackStyle={{height: sizeCalculator.height(10)}}
                        thumbStyle={{width: sizeCalculator.width(20), height: sizeCalculator.height(20), borderRadius: sizeCalculator.convertSize(20), paddingRight: sizeCalculator.convertSize(4)}}
                        minimumValue={0}
                        maximumValue={this.state.totalDuration}
                        minimumTrackTintColor="#232b62"
                        maximumTrackTintColor="#00a5e8"
                        //onSlidingComplete={(seekTo) => this.onSlidingComplete(seekTo)}
                    ></Slider>
                }
            </Fragment>
        );
    }
}