import React, {Component } from 'react';
import { View,TouchableOpacity, Image } from 'react-native';
import Slider from 'react-native-slider';

import {MediaManager} from '../../utility/MediaPlayer';
import sizeCalculator from '../tile-layouts/sizeCalculator';


export default class VolumeSlider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            volume: MediaManager.getVolume()
        }
    }

    onSlidingComplete(volume) {
        this.setState({volume: volume});
        MediaManager.setVolume(volume);
        this.props.onSlidingComplete();
    }
    
    toggleMute(e) {
        e.preventDefault();
        if (this.state.volume > 0) {
            this.setState({volume: 0});
            MediaManager.setVolume(0);
            this.props.onSlidingComplete();
        } else {
            this.setState({volume: 70});
            MediaManager.setVolume(70);
            this.props.onSlidingComplete();
        }
    }

    onClickSlider(volume) {
        //Calculate the percentage
        volume = parseInt((volume/sizeCalculator.width(600))*100);
        //this.onSlidingComplete(volume);
        this.setState({volume: volume});
        MediaManager.setVolume(volume);
    }

    render() {
        return(
            <View style={{
                bottom: sizeCalculator.height(110),
                left: sizeCalculator.width(170),
                position: 'absolute',
                width: sizeCalculator.width(735),
                height: sizeCalculator.height(80),
                paddingTop: sizeCalculator.height(17),
                zIndex: 200,
                paddingLeft: sizeCalculator.width(25),
                backgroundColor: 'white', 
                borderRadius: sizeCalculator.convertSize(20),
                borderColor: '#D7D8E2',
                borderWidth: sizeCalculator.width(3),
                flex: 1,
                flexDirection: 'row'
            }}>
                <TouchableOpacity style={{
                    position:'relative', 
                    height: '100%',
                    alignItems: 'center',
                    }}
                    onPress={(e) => this.toggleMute(e)}>
                    <Image
                        style={{height: sizeCalculator.height(45), width: sizeCalculator.width(45), resizeMode: 'contain', marginTop: sizeCalculator.height(-3), marginRight: sizeCalculator.width(30)}} 
                        source={require('../../components/FooterLayout/Buttons/volume-mute.png')}
                    />
                </TouchableOpacity>
                <Slider
                    onTouchStart={(e) => this.onClickSlider(e.nativeEvent.locationX)} 
                    disabled={false}
                    style={{
                        width: sizeCalculator.width(600)
                    }}
                    step={1}
                    value={this.state.volume}
                    trackStyle={{height: sizeCalculator.height(30)}}
                    thumbStyle={{width: sizeCalculator.width(50), height: sizeCalculator.height(50), borderRadius: sizeCalculator.convertSize(50), paddingRight: sizeCalculator.width(12)}}
                    minimumValue={0}
                    maximumValue={100}
                    minimumTrackTintColor="#232b62"
                    maximumTrackTintColor="#00a5e8"
                    onSlidingComplete={(volume) => this.onSlidingComplete(volume)}
                />
            </View>
        );
    }
}