import React, {Fragment, Component} from 'react';
import { Image, View, TouchableOpacity, Animated, Text, TouchableWithoutFeedback } from 'react-native';

import Video from 'react-native-video';
import { Bubbles } from 'react-native-loader';

import Timer from './timer';
import sizeCalculator from '../tile-layouts/sizeCalculator';

export default class VideoDeck extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buffering: false,
            totalDuration: 0,
            seekingTo: 0,
            showControls: true,

            //Controls opacity
            controlOpacity: 0,

            //For Ads
            adURL: null
        };
    }

    onReady(e) {
        let totalDuration = (this.props.type !== 'TV') ? e.duration : null;
        this.setState({buffering: false, totalDuration: totalDuration});
        //this.calculateAds(totalDuration);

        if ('timer' in this.props && this.props.timer) {
            this.videoTimer.setTotalDuration(totalDuration);
        }

        if ('onReady' in this.props) {
            this.props.onReady(totalDuration);
        }
    }

    onBuffer() {
        this.setState({buffering: true});

        if ('onBuffering' in this.props) {
            this.props.onBuffering();
        }
    }

    onVideoPlaying(currentTime) {
        if ('onProgress' in this.props) {
            this.props.onProgress(currentTime);
        }

        if ('timer' in this.props && this.props.timer) {
            this.videoTimer.setSeek(currentTime);
        }
    }

    onResume() {
        let seekingTo = this.state.seekingTo;
        this.setState({buffering: false, seekingTo: seekingTo});
        this.player.seek(seekingTo);

        if ('onResume' in this.props) {
            this.props.onResume(seekingTo);
        }
    }

    onEnd() {
        if ('onEnd' in this.props) {
            this.props.onEnd();
        }
    }

    jumpToPosition(position) {
        this.player.seek(position);
        this.setState({seekingTo: position});
    }

    jumpForward() {
        let position = parseFloat(this.state.seekingTo);
        position = position+15;
        if (position > this.state.totalDuration) {
            position = this.state.totalDuration;
        }
        this.player.seek(position);
        this.setState({seekingTo: position});
    }

    jumpBack() {
        let position = parseFloat(this.state.seekingTo);
        position = position-15;
        if (position < 0) {
            position = 0;
        }
        this.player.seek(position);
        this.setState({seekingTo: position});
    }

    toggleFullScreen() {
        if('timer' in this.props && this.props.timer) {
            if (!this.props.fullScreen) { //It is not full screen yet.
                this.videoTimer.enableFullScreenMode();

                if (this.hideControl) {
                    clearTimeout(this.hideControl);
                }
                this.hideControl = setTimeout(function() {
                    this.videoTimer.fullScreenModeControlsHidden();
                }.bind(this), 5000);
            } else {
                this.videoTimer.disableFullScreenMode();
            }
        }

        this.props.toggleFullScreen();
    }

    onFullScreenTap() {
        if (this.props.fullScreen) {
            this.props.onFullScreenTap()
        }

        if('timer' in this.props && this.props.timer) {
            if (this.props.fullScreen) {
                if (this.props.timer) {
                    this.videoTimer.fullScreenModeControlsShow();
                }
                
                if (this.hideControl) {
                    clearTimeout(this.hideControl);
                }
                this.hideControl = setTimeout(function() {
                    if (this.props.timer) {
                        this.videoTimer.fullScreenModeControlsHidden();
                    }
                }.bind(this), 5000);
            }
        }
    }

    toggleMinimize() {
        if (this.props.timer) {
            this.videoTimer.disableFullScreenMode();
        }
        this.props.toggleMinimize();
    }

    componentWillUnmount() {
        if (this.hideControl) {
            clearTimeout(this.hideControl);
        }
    }

    /**
     * Ads Starts Here
     */
    playAd(adUrl) {
        this.setState({adURL: adUrl});
    }
    adPlayerReady(e) {
        //Ads Player Loaded. Signal the main component for pausing the main video
        this.props.onAdStart();
    }
    onAdEnd() {
        this.setState({adURL: null});
        this.props.onAdEnd();
    }
    onAdError() {
        this.setState({adURL: null});
        this.props.onAdError();
    }
    /**
     * Ads Ends Here
     */

    render() {
        return(
            <View style={{height: this.props.height, width: '100%', backgroundColor: '#000', position: 'relative'}}>
                {(this.state.buffering) && 
                    <View style={{position: 'absolute', top: '50%', left: '50%', marginLeft: sizeCalculator.width(-96), marginTop: sizeCalculator.height(-30), zIndex: 20}}>
                        <Bubbles size={sizeCalculator.convertSize(30)} color="#FFF" spaceBetween={sizeCalculator.width(10)} />
                    </View>
                }
                {this.state.showControls && 
                    <Fragment>
                        <TouchableOpacity style={{
                            position:'absolute', 
                                height: sizeCalculator.height(60),
                                width: sizeCalculator.width(60),
                                right: 0,
                                top: 0,
                                zIndex: 55,
                                alignItems: 'center',
                                opacity: 0.7
                            }}
                            onPress={() => this.props.exit()}>
                            <Image
                                style={{height: 30, width: 30, resizeMode: 'contain', marginTop: 7}} 
                                source={require('./images/close-button.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            position:'absolute', 
                                height: sizeCalculator.height(60),
                                width: sizeCalculator.width(60),
                                left: 0,
                                top: 0,
                                zIndex: 55,
                                alignItems: 'center',
                                opacity: 0.7
                            }}
                            onPress={() => this.toggleMinimize()}>
                            {this.props.minimize ?
                                <Image
                                    style={{height: sizeCalculator.height(30), width: sizeCalculator.width(30), resizeMode: 'contain', marginTop: sizeCalculator.height(7)}} 
                                    source={require('./images/maximize-icon.png')}
                                />:
                                <Image
                                    style={{height: sizeCalculator.height(30), width: sizeCalculator.width(30), resizeMode: 'contain', marginTop: sizeCalculator.height(7)}} 
                                    source={require('./images/minimize-icon.png')}
                                />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            position:'absolute', 
                                height: sizeCalculator.height(60),
                                width: sizeCalculator.width(60),
                                right: 0,
                                bottom: 0,
                                zIndex: 55,
                                alignItems: 'center',
                                opacity: 0.7
                            }}
                            onPress={() => this.toggleFullScreen()}>
                            {this.props.fullScreen ?
                                <Image
                                    style={{height: sizeCalculator.height(30), width: sizeCalculator.width(30), resizeMode: 'contain', marginTop: sizeCalculator.height(7)}} 
                                    source={require('./images/exit-fullscreen-icon.png')}
                                />:
                                <Image
                                    style={{height: sizeCalculator.height(30), width: sizeCalculator.width(30), resizeMode: 'contain', marginTop: sizeCalculator.height(7)}} 
                                    source={require('./images/full-screen-icon.png')}
                                />
                            }
                        </TouchableOpacity>
                        {this.props.timer &&
                            <Timer ref={(ref) => {this.videoTimer = ref}} fullScreen={this.props.fullScreen} />
                        }
                    </Fragment>
                }
                {this.props.fullScreen && 
                    <TouchableOpacity style={{
                        position:'absolute', 
                            height: '85%',
                            width: '100%',
                            right: 0,
                            top: sizeCalculator.height(60),
                            zIndex: 55,
                            alignItems: 'center',
                            opacity: 0,
                            backgroundColor: '#fff'
                        }}
                        onPress={() => this.onFullScreenTap()}>
                    </TouchableOpacity>
                }
                <Video source={{uri: this.props.url}}
                    ref={(ref) => {
                        this.player = ref
                    }}
                    onLoad={(e) => this.onReady(e)}
                    onBuffer={() => this.onBuffer()} // Callback when remote video is buffering
                    onLoadStart={() => this.onBuffer()} //Callback when buffering
                    //onError={this.videoError}               // Callback when video cannot be loaded
                    style={{
                        width: '100%',
                        height: '100%',
                        zIndex: 11
                    }}
                    volume={this.props.volume}
                    resizeMode='contain'
                    paused={!this.props.playing}
                    onProgress={(time) => this.onVideoPlaying(time.currentTime)}
                    onEnd={() => this.onEnd()}
                    bufferConfig={{
                        minBufferMs: (30*1000),
                        maxBufferMs: (60*1000),
                        bufferForPlaybackMs: (30*1000),
                        playbackAfterRebufferMs: (30*1000)
                    }}
                    onPlaybackStalled={() => this.onBuffer()}
                    onPlaybackResume={() => this.onResume()}
                />
                {this.state.adURL !== null &&
                    <Fragment>
                        <Text style={{position: 'absolute', zIndex: 15, bottom: 10, left: 10, color: '#ccc', backgroundColor: '#33333380', padding: 5}}>Sponsored</Text>
                        <Video source={{uri: this.state.adURL}}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 13
                            }}
                            ref={(ref) => {
                                this.adplayer = ref
                            }}
                            onLoad={(e) => this.adPlayerReady(e)}
                            //onBuffer={() => this.onBuffer()} // Callback when remote video is buffering
                            //onLoadStart={() => this.onBuffer()} //Callback when buffering
                            onError={() => this.onAdError()}               // Callback when video cannot be loaded
                            
                            volume={this.props.volume}
                            resizeMode='contain'
                            paused={false}
                            onEnd={() => this.onAdEnd()}
                            bufferConfig={{
                                minBufferMs: (30*1000),
                                maxBufferMs: (60*1000),
                                bufferForPlaybackMs: (30*1000),
                                playbackAfterRebufferMs: (30*1000)
                            }}
                            onPlaybackStalled={() => this.onBuffer()}
                            onPlaybackResume={() => this.onResume()}
                        />
                    </Fragment>
                }
            </View>
        );
    }
}