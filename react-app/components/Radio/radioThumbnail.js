import React, {Component} from 'react';
import { Image, View, TouchableOpacity } from 'react-native';

import {MediaManager} from '../../utility/MediaPlayer';

import { Bars } from 'react-native-loader';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class RadioThumbnail extends Component {

    constructor(props){
        super(props);
        this.state = {
            buffering: false
        }
    }

    playRadio(radio) {
        if (this.state.buffering) {
            return;
        }

        let playingRadio = (this.props.current === null)? radio : ((this.props.current.id === radio.id)? null : radio);
        
        this.props.onPlaying(playingRadio);
        playingRadio = MediaManager.buildtrack('Radio', playingRadio);
        if (playingRadio) {
            this.setState({buffering: true});
        }
        MediaManager.playRadio(playingRadio, function() {
            this.setState({buffering: false});
        }.bind(this));

        MediaManager.onStopMedia(function() {
            this.setState({buffering: false});
            this.props.onPlaying(null);
        }.bind(this));
    }

    render() {
        return (
            <View style={{padding: sizeCalculator.convertSize(25), height: sizeCalculator.height(350), width: sizeCalculator.width(350), alignSelf: 'center', position: 'relative'}}>
                <Image
                    style={{width: '100%', height: '100%', alignSelf: 'center'}}
                    source={this.props.radio.thumbnail} />
                <View style={{
                    width: '100%', 
                    height: sizeCalculator.height(70),
                    backgroundColor: 'rgba(3, 80, 164, 0.8)', 
                    position: 'absolute', 
                    bottom: sizeCalculator.height(25), 
                    right: sizeCalculator.width(25)
                    }}>
                </View>
                <TouchableOpacity
                    onPress={() => this.playRadio(this.props.radio)}
                    style={{
                        width: '100%', 
                        height: '100%',
                        position: 'absolute', 
                        bottom: sizeCalculator.height(25), 
                        right: sizeCalculator.width(25)
                    }}
                    >
                    {this.props.current !== null && this.props.current.id === this.props.radio.id && (!this.state.buffering) && 
                        <Image
                            style={{width: '100%', height: sizeCalculator.height(43), resizeMode: 'contain', marginTop: sizeCalculator.height(241)}}
                            source={require('../images/icons/pause-button.png')}
                        />
                    }
                    {(this.state.buffering) && 
                        <View style={{position: 'absolute',  height: sizeCalculator.height(43), width: '100%', bottom: sizeCalculator.height(25), left: '50%', marginLeft: sizeCalculator.width(-35), marginTop: sizeCalculator.height(-10), zIndex: 20}}>
                            <Bars size={sizeCalculator.convertSize(21)} color="#fff" spaceBetween={sizeCalculator.width(7)} />
                        </View>
                    }
                    {(this.props.current === null || this.props.current.id !== this.props.radio.id && (!this.state.buffering)) && 
                        <Image
                            style={{width: '100%', height: sizeCalculator.height(43), resizeMode: 'contain', marginTop: sizeCalculator.height(241)}}
                            source={require('../images/icons/play-button.png')}
                        />
                    }
                </TouchableOpacity>
            </View>
        )
    }
}