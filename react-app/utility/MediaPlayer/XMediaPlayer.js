import React, {Fragment, Component} from 'react';
import { Image, View, TouchableOpacity, Animated, Text } from 'react-native';
import TrackPlayer from "react-native-track-player";
import config from '../config';
import RNFS from 'react-native-fs';

import VideoDeck from './VideoDeck';
import AudioControls from './audioControls';
import TopBar from './topbar';
import SeekingSlider from './SeekingSlider';

import DataManagerService from '../../service/DataManagerService';
import VideoControl from './videoControls';

import LoggingService from '../../service/LoggingService';
import sizeCalculator from '../tile-layouts/sizeCalculator';
import AdsManager from '../../service/AdsManager';
import InternetService from '../../service/InternetService';

var MediaPlayer__Stop = function(mediaType, callback) {
    if (typeof this.stopMedia === 'function') {
        this.stopMedia(mediaType);
    }
}

var MediaPlayer__Play = function(media, callback) {
    this.playMedia(media, callback);
}

var MediaPlayer__GetMediaInfo = function() {
    return this.state.playingMedia;
}

var MediaPlayer__SetVolume = function(volume) {
    this.setVolume(volume);
}

var MediaPlayer__GetVolume = function () {
    return this.state.playerVolume*100;
}

var MediaPlayer__RegisterOnStop = function(func) {
    this.onStop = func;
}

var MediaPlayer__RegisterOnNextMedia = function(func) {
    this.onNextMedia = func;
}

var MediaPlayer__RegisterOnPreviousMedia = function(func) {
    this.onPreviousMedia = func;
}

class MediaPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minimize: true,
            fullScreen: false,
            videoDeck: false, //Used to mark if video deck which plays video is ready or not.
            totalDuration: 0,
            
            topBar: false,

            playerVolume: 0.7,
            mediaType: null, //TV | Video | Music | Radio,
            controls: {
                play: true,
                pause: true,
                nextTrack: false,
                previousTrack: false,
                advance: false,
                back: false,
                seeker: false,
                stop: false,
                repeat: false,
                equilizer: false,
                timer: false,
                videoAdsAllowed: false
            },
            playlist: [],
            currentTrackNumber: 0,

            playingMedia: null,
            videoPlayingHeight: sizeCalculator.height(250),

            play: true, //Play or Pause Media Playing,
            playerWidth: sizeCalculator.width(430),

            playerStyle: {
                right: sizeCalculator.width(10),
                bottom: sizeCalculator.height(114),
                border: sizeCalculator.convertSize(3)
            },

            adsTimings: [],
            lastAdTime: 0,
            adsSource: null,
            playingAd: false
        }

        MediaPlayer__Play = MediaPlayer__Play.bind(this);
        MediaPlayer__GetMediaInfo = MediaPlayer__GetMediaInfo.bind(this);
        MediaPlayer__SetVolume = MediaPlayer__SetVolume.bind(this);
        MediaPlayer__GetVolume = MediaPlayer__GetVolume.bind(this);
        MediaPlayer__RegisterOnStop = MediaPlayer__RegisterOnStop.bind(this);
        MediaPlayer__RegisterOnNextMedia = MediaPlayer__RegisterOnNextMedia.bind(this);
        MediaPlayer__RegisterOnPreviousMedia = MediaPlayer__RegisterOnPreviousMedia.bind(this);
        MediaPlayer__Stop = MediaPlayer__Stop.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.playingMedia === null) { //Nothing was playing before
            //Check if something is about to play or not.
            if (this.state.playingMedia !== null) {
                LoggingService.log({
                    type: this.state.mediaType,
                    action: 'START',
                    data: this.state.playingMedia
                })
            }
        } else {//Something was playing before.
            //Check if current media is stopping or not
            if (this.state.playingMedia === null || this.state.playingMedia !== this.state.playingMedia) {
                LoggingService.log({
                    type: prevState.mediaType,
                    action: 'STOP',
                    data: prevState.playingMedia
                })
            }

            //check if next media is different than current media.
            if (prevState.playingMedia !== this.state.playingMedia && this.state.playingMedia !== null) {
                LoggingService.log({
                    type: this.state.mediaType,
                    action: 'START',
                    data: this.state.playingMedia
                })
            }
        }

        //Change in player volume
        if (this.state.playerVolume !== prevState.playerVolume) {
            let action = (this.state.playerVolume === 0)? 'VOLUME_MUTE' : ( (prevState.playerVolume > this.state.playerVolume) ? 'VOLUME_LOW' : 'VOLUME_UP' );
            LoggingService.log({
                type: "Settings",
                action: action,
                data: this.state.playerVolume
            })
        }
    }

    /***
     * Ads Code starts here
     */
    calculateVideoAdsTime(duration) {
        if (this.state.controls.videoAdsAllowed) {
            let AdTimes = [];
            let currentTime = new Date();
            currentTime = parseInt(currentTime.getTime()/1000);
            let adTime = 0;
            if ((currentTime - this.state.lastAdTime) > (config.sweetVideoPlayTime * 60)) {
                //Start the Ad immediately
                AdTimes.push(adTime);
            }

            if (duration < 110 || !duration) {
                AdTimes.push(0.5 * duration);
            } else if (duration <= (config.sweetVideoPlayTime * 60)) {
                AdTimes.push(parseInt(0.3 * duration));
                AdTimes.push(parseInt(0.65 * duration));
            } else {
                let _duration = duration;
                let adDifference = parseInt(0.8*config.sweetVideoPlayTime*60);
                do {
                    adTime += adDifference;
                    AdTimes.push(adTime);
                    _duration = _duration - adDifference;
                } while (_duration > adDifference);
            }

            this.setState({adsTimings: AdTimes});
            console.log('Ads Time', AdTimes);
        }
    }

    checkForAds(seek) {
        if (this.state.controls.videoAdsAllowed) {
            /**
             * IF any Ad has just played or not. May be 15 seconds before.
             * 
             */
            let currentTime = new Date();
            let adsTime = this.state.adsTimings;
            currentTime = parseInt(currentTime.getTime()/1000);
            if (((currentTime - this.state.lastAdTime) < 60)  && seek >= this.state.adsTimings[0]) {
                //The Ad was played very soon.
                adsTime.shift();
                this.setState({adsTimings: adsTime});
                return false;
            }

            if (this.state.adsTimings.length > 0 && seek >= this.state.adsTimings[0]) { //Ads must be played
                var onlyLocal = true;
                if (InternetService.isConnected()) {
                    onlyLocal = false;
                }
                AdsManager.nextVideoAds(onlyLocal).then(function(videoAd) {
                    adsTime.shift();
                    if (videoAd.local_url && videoAd.local_url.length > 0) { //Check if LocalURL is there or not. If it is there.
                        let _this = this;
                        RNFS.exists(videoAd.local_url).then(function (bool) { //Check if there is a file in that location.
                            if (bool) {
                                _this.videoPlayerRef.playAd(videoAd.local_url);
                            } else { //If file is not present
                                if (InternetService.isConnected()) { //Check if internet is present
                                    _this.videoPlayerRef.playAd(videoAd.remote_url); //Stream Ad from Internet.
                                }
                            }
                        }.bind(_this));
                    } else { //If localURL is not present
                        if (InternetService.isConnected()) { //Check if internet is present
                            this.videoPlayerRef.playAd(videoAd.remote_url); //Stream Ad from Internet.
                        } else {
                            videoAd = null;
                        }
                    }
                    var log_url = videoAd.remote_url.split('/');
                    var file = log_url.pop() || log_url.pop();
                    
                    let videoDataToSend = {
                        id: videoAd.campaign_id,
                        fileName: file.toUpperCase()
                    }
                    LoggingService.log({
                        type: 'VIDEOADS',
                        action: 'VideoAdsPlaying',
                        data: videoDataToSend
                    })
                    this.setState({adsTimings: adsTime, adsSource: videoAd});
                }.bind(this)).catch(function(e) {
                    console.log('Error while fetching video ads',e);
                    let adsTime = this.state.adsTimings;
                    adsTime.shift();
                    this.setState({adsTimings: adsTime, adsSource: null});
                }.bind(this));
            }
        }
    }
    onAdStart() {
        let currentTime = new Date();
        currentTime = parseInt(currentTime.getTime()/1000);
        this.setState({play: false, playingAd: true, lastAdTime: currentTime});
    }
    onAdEnd() {
        AdsManager.markImpression(this.state.adsSource).then(function () {
            // Increase Impression Count. And send log
            this.setState({play: true, playingAd: false, adsSource: null});
        }.bind(this));
    }
    onAdError() {
        this.setState({play: true, playingAd: false, adsSource: null});
    }
    /***
     * Ads Code Ends Here
     */
    
    getAvailableMedia() {
        return ['TV', 'Radio', 'Video', 'Music'];
    }

    isAvailableMedia(mediaType) {
        let medias = ['TV', 'Radio', 'Video', 'Music'];
        if (medias.includes(mediaType)) {
            return true;
        } else {
            return false;
        }
    }

    getControls(media) {
        media = media || this.state.mediaType
        let controls = {
            play: true,
            pause: true,
            nextTrack: false,
            previousTrack: false,
            advance: false,
            back: false,
            seeker: false,
            stop: false,
            repeat: false,
            timer: false,
            videoAdsAllowed: false
        };
        if (!media) {
            console.warn(`Media type unknown expected 'TV', 'Radio', 'Video', 'Music' but is, ${media}.`);
            return;
        }
        switch (media) {
            case 'TV':
                controls = {
                    play: true,
                    pause: true,
                    nextTrack: true,
                    previousTrack: true,
                    advance: false,
                    back: false,
                    seeker: false,
                    stop: false,
                    repeat: false,
                    equilizer: false,
                    timer: false,
                    videoAdsAllowed: false
                };
                break;
            case 'Video':
                controls = {
                    play: true,
                    pause: true,
                    nextTrack: true,
                    previousTrack: true,
                    advance: true,
                    back: true,
                    seeker: true,
                    stop: true,
                    repeat: true,
                    equilizer: false,
                    timer: true,
                    videoAdsAllowed: true
                };
                break;
            case 'Music':
                controls = {
                    play: true,
                    pause: true,
                    nextTrack: true,
                    previousTrack: true,
                    advance: true,
                    back: true,
                    seeker: true,
                    stop: true,
                    repeat: true,
                    equilizer: true,
                    timer: true,
                    videoAdsAllowed: false
                };
                break;
            case 'Radio':
                controls = {
                    play: true,
                    pause: false,
                    nextTrack: true,
                    previousTrack: true,
                    advance: false,
                    back: false,
                    seeker: false,
                    stop: true,
                    repeat: false,
                    equilizer: true,
                    timer: false,
                    videoAdsAllowed: false
                };
                break;
        }

        this.setState({controls: controls});
    }

    setVolume(volume) {
        this.setState({playerVolume: volume*0.01});
        TrackPlayer.setVolume(parseFloat(volume*0.01));
    }

    nextTrack() {
        if (typeof this.onNextMedia === 'function') {
            this.onNextMedia();
            return;
        }

        if (this.state.controls.nextTrack && this.state.playlist.length > 1) {
            //Go To next track or Stop
            let currentTrackNumber = this.state.currentTrackNumber;
            currentTrackNumber++;
            if (currentTrackNumber >= this.state.playlist.length) {
                return;
            } else {
                this.playVideo(this.state.playlist[currentTrackNumber]);
                this.setState({currentTrackNumber: currentTrackNumber});
            }
        }
    }

    forwardTrack() {
        //Jump next 10 seconds.
        if (this.state.controls.advance) {
            if (this.state.videoDeck) {
                this.videoPlayerRef.jumpForward();
            } else {
                //For Audio
            }
        }
    }

    previousTrack() {
        if (typeof this.onPreviousMedia === 'function') {
            this.onPreviousMedia();
            return;
        }

        if (this.state.controls.previousTrack && this.state.playlist.length > 1) {
            let currentTrackNumber = this.state.currentTrackNumber;
            currentTrackNumber--;
            if (currentTrackNumber < 0) {
                return;
            } else {
                this.playVideo(this.state.playlist[currentTrackNumber]);
                this.setState({currentTrackNumber: currentTrackNumber});
            }
        }
    }

    backTrack() {
        //Jump next 10 seconds.
        if (this.state.controls.back) {
            if (this.state.videoDeck) {
                this.videoPlayerRef.jumpBack();
            } else {
                //For Audio
            }
        }
    }

    playRadio(media) {
        TrackPlayer.stop();
        TrackPlayer.reset();
        this.getControls('Radio');
        return new Promise(function (resolve, reject) {
            let that=this;
            TrackPlayer.add(media).then(function() {
                TrackPlayer.play();
                that.setState({mediaType: 'Radio', playingMedia: media, currentTrackNumber: 0});
                resolve();
            }.bind(that)).catch(e => {
                console.log(`Error while playing Radio`, e);
                return reject();
            })
        }.bind(this));
    }

    playTV(media) {
        TrackPlayer.stop();
        TrackPlayer.reset();
        this.getControls('TV');
        this.setState({mediaType: 'TV', playingMedia: media, currentTrackNumber: 0, play: true});
        return new Promise(function (resolve, reject) {
            let retry = 0;
            let that = this;
            let intervalCounter = setInterval(function() {
                if (that.state.videoDeck) {
                    clearInterval(intervalCounter);
                    intervalCounter = undefined;
                    resolve();
                } else {
                    if (retry > config.videoLoadTimeout) {
                        clearInterval(intervalCounter);
                        intervalCounter = undefined;
                        return reject();
                    }
                    retry++;
                }
            }.bind(that), 1000);
        }.bind(this));
    }

    playVideo(media) {
        TrackPlayer.stop();
        TrackPlayer.reset();
        this.getControls('Video');
        this.setState({mediaType: 'Video', playingMedia: media, play: true});
        return new Promise(function (resolve, reject) {
            let retry = 0;
            let that = this;
            let intervalCounter = setInterval(function() {
                if (that.state.videoDeck) {
                    clearInterval(intervalCounter);
                    intervalCounter = undefined;
                    resolve();
                } else {
                    if (retry > config.videoLoadTimeout) {
                        clearInterval(intervalCounter);
                        intervalCounter = undefined;
                        return reject();
                    }
                    retry++;
                }
            }.bind(that), 1000);
        }.bind(this));
    }

    playMusic(media) {
        this.getControls('Music');
        this.setState({mediaType: 'Music'});
    }

    markVideoPlayerReady(duration) {
        this.calculateVideoAdsTime(duration);
        if (this.state.controls.seeker) {
            this.sliderRef.updateDuration(duration);
        } else {
            duration = 0;
        }
        
        this.setState({videoDeck: true, totalDuration: duration});
    }

    addToPlayList(media) {
        //Only Video and Music has playlists
        let allowedMedia = ['Video', 'Music'];
        //Check if it is music or video
        if (allowedMedia.includes(media.type)) {
            let currentList = this.state.playlist;
            currentList.push(media);
            this.setState({playlist: currentList});
        } else {
            this.setState({playlist: []});
        }
    }

    closePlayer() {
        if (this.hidingControlTimeout) {
            clearTimeout(this.hidingControlTimeout);
        }

        DataManagerService.unregisterAudioVideoEvents();
        //Stop Audio
        TrackPlayer.stop();
        TrackPlayer.reset();

        if (typeof this.onStop === 'function') {
            this.onStop();
        }
        
        delete this.onNextMedia;
        delete this.onPreviousMedia;
        delete this.onStop;

        //Stop Video and Close the MediaPlayer
        this.setState({
            minimize: true,
            fullScreen: false,
            videoDeck: false, //Used to mark if video deck which plays video is ready or not.
            totalDuration: 0,
            
            topBar: false,

            mediaType: null, //TV | Video | Music | Radio,
            controls: {
                play: true,
                pause: true,
                nextTrack: false,
                previousTrack: false,
                advance: false,
                back: false,
                seeker: false,
                stop: false,
                repeat: false,
                equilizer: false            },
            playlist: [],
            currentTrackNumber: 0,

            playingMedia: null,
            videoPlayingHeight: sizeCalculator.height(250),

            play: true, //Play or Pause Media Playing,
            playerWidth: sizeCalculator.width(430),

            playerStyle: {
                right: sizeCalculator.width(10),
                bottom: sizeCalculator.height(114),
                border: sizeCalculator.convertSize(3)
            },

            adsTimings: [],
            adsSource: null,
            playingAd: false

        });

        if ('onClose' in this.props) {
            this.props.onClose();
        }
    }

    stopMedia(mediaType) {
        mediaType = mediaType || null;
        
        if (this.hidingControlTimeout) {
            clearTimeout(this.hidingControlTimeout);
        }

        if (mediaType) {
            if (this.state.mediaType === mediaType) {
                //Stop Immediately and Close Player
                DataManagerService.unregisterAudioVideoEvents();
                this.closePlayer();
                return;
            }
        } else {
            DataManagerService.unregisterAudioVideoEvents();
            if (this.state.mediaType === 'Radio') {
                this.closePlayer();
                return;
            }

            TrackPlayer.stop();
            TrackPlayer.reset();

            this.setState({
                minimize: true,
                fullScreen: false,
                videoDeck: false, //Used to mark if video deck which plays video is ready or not.
                totalDuration: 0,

                mediaType: null,
                currentTrackNumber: 0,
                playingMedia: null,
                play: true,

                videoPlayingHeight: sizeCalculator.height(250),
                playerWidth: sizeCalculator.width(430),

                playerStyle: {
                    right: sizeCalculator.width(10),
                    bottom: sizeCalculator.height(114),
                    border: sizeCalculator.convertSize(3)
                },

                adsTimings: [],
                adsSource: null,
                playingAd: false
            });

            if (typeof this.onStop === 'function') {
                this.onStop();
            }
            
            delete this.onNextMedia;
            delete this.onPreviousMedia; 
            delete this.onStop;
        }

        if ('onStop' in this.props) {
            this.props.onStop();
        }
    }

    togglePlayPause() {
        let playPasue = this.state.play;
        if (this.state.mediaType === 'Radio') { //No play pause for Radio. Only for TV, Video and Music
            console.warn(`Cannot pause a Radio. The current media type is set as ${this.state.mediaType}`);
            return;
        }
        if (!this.state.controls.pause) {
            console.warn(`Play pause functionality has been not enabled for this media.`);
            return;
        }
        this.setState({play: !playPasue});
    }

    playMedia (media, callback) {
        DataManagerService.unregisterAudioVideoEvents();
        callback = callback || false;
        let currentTrackNumber = 0;

        if (!media) {
            //Stop everything - Should only come for Radio.
            this.stopMedia();
            return true;
        }

        if (!this.isAvailableMedia(media.type)) {
            console.log(`Invalid Media Type. Expected 'TV', 'Radio', 'Video', 'Music' got ${media.type}`);
            return false;
        }

        if (this.state.mediaType === media.type) {
            //if the format of current media and the next media played is same then add to playlist
            currentTrackNumber = this.state.playlist.length;
            this.addToPlayList(media);
        } else {
            //else clear the playlist
            if (this.state.mediaType !== null) {
                delete this.onNextMedia;
                delete this.onPreviousMedia;
            }
            this.setState({playlist: []});
            this.addToPlayList(media);
        }
        this.setState({
            mediaType: media.type, 
            currentTrackNumber: currentTrackNumber,
            adsTimings: [],
            adsSource: null,
            playingAd: false
        }); //Set media type

        this.getControls(media.type);

        if (this.state.playingAd) {
            this.videoPlayerRef.playAd(null);
        }

        switch (media.type) {
            case 'Radio':
                this.playRadio(media).then(() => {
                    let pendingPlayerStatus = setInterval(function() {
                        TrackPlayer.getState().then(function(state) {
                            if (state === TrackPlayer.STATE_PLAYING) {
                                if (callback) {
                                    callback();
                                }
                                clearInterval(pendingPlayerStatus)
                                pendingPlayerStatus = false;
                            }
                        });
                    }, 300);
                }).catch(() => {
                    console.log(`Cannot play radio. Some error occured while loading media`);
                });
                break;
            case 'TV':
                this.playTV(media).then(() => {
                    if (callback) {
                        callback();
                    }
                }).catch(e => {
                    console.log(`Cannot play live TV. Some error occured while loading media`);
                })
                break;
            case 'Video':
                    this.playVideo(media).then(() => {
                        if (callback) {
                            callback();
                        }
                    }).catch(e => {
                        console.log(`Cannot play live TV. Some error occured while loading media`);
                    })
                break;
            case 'Music':
                break;
        }

        if ('onPlaying' in this.props) {
            this.props.onPlaying();
        }
    }

    jumpToPosition(seek) {
        if (this.state.videoDeck) {
            this.videoPlayerRef.jumpToPosition(seek)
        } else {
            //This is audio file
        }
    }

    onVideoProgress(seek) {
        if (this.state.controls.seeker) {
            this.sliderRef.updateSlidingPosition(seek)
        }
        this.checkForAds(seek);
    }

    toggleMinimize() {
        let minimize = this.state.minimize;
        let playerWidth = minimize ? sizeCalculator.width(700) : sizeCalculator.width(430);
        let videoPlayingHeight = minimize ? sizeCalculator.height(400) : sizeCalculator.height(250);
        let playerStyle = minimize ? {right: sizeCalculator.width(290), bottom: sizeCalculator.height(150), border: sizeCalculator.convertSize(3)} : { bottom: sizeCalculator.height(114) , right: sizeCalculator.width(10), border: sizeCalculator.convertSize(3)};
        this.setState({minimize: !minimize, playerWidth, videoPlayingHeight, playerStyle, fullScreen: false});
        this.videoControl.toggleFullScreenMode(false);
        if (this.state.controls.seeker) {
            this.sliderRef.toggleForFullScreen(false);
        }
    }

    toggleFullScreen() {
        if (this.hidingControlTimeout) {
            clearTimeout(this.hidingControlTimeout);
        }
        let fullScreen = this.state.fullScreen;
        let playerStyle = fullScreen ? {right: sizeCalculator.width(290), bottom: sizeCalculator.height(150), border: sizeCalculator.convertSize(3)} : {right: 0, bottom: 0, border:0};
        let playerWidth = fullScreen ? sizeCalculator.width(700) : sizeCalculator.getDeviceWidth();
        let videoPlayingHeight = fullScreen ? sizeCalculator.height(400) : sizeCalculator.height(800);
        this.setState({fullScreen: !fullScreen, playerWidth, videoPlayingHeight, playerStyle, minimize: false});
        
        //Calling Fullscreen event for seeker
        if (this.state.controls.seeker) {
            this.sliderRef.toggleForFullScreen(!fullScreen);
        }

        this.videoControl.toggleFullScreenMode(!fullScreen);
        if (!fullScreen) {
            this.hidingControlTimeout = setTimeout(function() {
                this.videoControl.hideControls();
                if (this.state.controls.seeker) {
                    this.sliderRef.pullDown();
                }
            }.bind(this), 5000);
        }
    }

    onFullScreenTap() {
        if (!this.state.fullScreen) {
            return false;
        }

        this.videoControl.showControls();
        if (this.state.controls.seeker) {
            this.sliderRef.pullUp();
        }

        if (this.hidingControlTimeout) {
            clearTimeout(this.hidingControlTimeout);
        }
        this.hidingControlTimeout = setTimeout(function() {
            this.videoControl.hideControls();
            if (this.state.controls.seeker) {
                this.sliderRef.pullDown();
            }
        }.bind(this), 5000);
    }

    render() {
        let flexDirection = 'row';
        if ((this.state.mediaType === 'TV') || (this.state.mediaType === 'Video')) {
            flexDirection = 'column';
        }
        return (
            <Fragment>
                {(this.state.mediaType !== null) && 
                    <Fragment>
                        <View style={{
                            flex: 1,
                            flexDirection: flexDirection,
                            width: this.state.playerWidth,
                            position: 'absolute',
                            zIndex: 50,
                            bottom: this.state.playerStyle.bottom,
                            right: this.state.playerStyle.right,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            borderColor: '#D7D8E2',
                            borderWidth: this.state.playerStyle.border,
                        }}>
                            {this.state.topBar && <TopBar />}
                            {((this.state.mediaType === 'TV') || (this.state.mediaType === 'Video')) &&
                                <Fragment>
                                    {this.state.playingMedia &&
                                        <Fragment>
                                            <VideoDeck
                                                ref={(ref) => {this.videoPlayerRef = ref}}
                                                height={this.state.videoPlayingHeight}
                                                url={this.state.playingMedia.url}
                                                onEnd={() => this.stopMedia()}
                                                volume={this.state.playerVolume}
                                                playing={this.state.play}
                                                exit={() => this.closePlayer()}
                                                minimize={this.state.minimize}
                                                fullScreen={this.state.fullScreen}
                                                timer={this.state.controls.timer}
                                                onReady={(duration) => this.markVideoPlayerReady(duration)}
                                                onProgress={(seek) => this.onVideoProgress(seek)}
                                                toggleMinimize={() => this.toggleMinimize()}
                                                toggleFullScreen={() => this.toggleFullScreen()}
                                                onFullScreenTap={() => this.onFullScreenTap()}

                                                onAdStart={() => this.onAdStart()}
                                                onAdEnd={() => this.onAdEnd()}
                                                onAdError={() => this.onAdError()}
                                            />
                                            {this.state.controls.seeker && 
                                                <SeekingSlider 
                                                    ref={(ref) => {this.sliderRef = ref}}
                                                    width={this.state.playerWidth}
                                                    totalDuration={this.state.totalDuration}
                                                    fullScreen={this.state.fullScreen}
                                                    onClickOnSlider={(seek) => this.jumpToPosition(seek)} 
                                                    disabled={this.state.playingAd}
                                                />
                                            }
                                            <VideoControl
                                                ref={(ref) => {this.videoControl = ref}}
                                                playing={this.state.play}
                                                mediaType={this.state.mediaType}
                                                controls={this.state.controls} 
                                                fullScreen={this.state.fullScreen}
                                                onStop={() => this.stopMedia()}
                                                onTogglePlayPause={() => this.togglePlayPause()}
                                                onNextTrack={() => this.nextTrack()}
                                                onPreviousTrack={() => this.previousTrack()}
                                                onForwardTrack={() => this.forwardTrack()}
                                                onBackTrack = {() => this.backTrack()} 
                                                disabled={this.state.playingAd}
                                            />
                                        </Fragment>
                                    }
                                </Fragment>
                            }
                            {((this.state.mediaType === 'Radio') || (this.state.mediaType === 'Music')) &&
                                <Fragment>
                                    <View style={{width: sizeCalculator.width(130)}}>
                                        {(this.state.playingMedia && 'image' in this.state.playingMedia) && 
                                            <Image source={this.state.playingMedia.image}
                                                style={{width: '100%', height: sizeCalculator.height(130), resizeMode: 'cover'}} />
                                        }
                                    </View>
                                    <View style={{flex: 3, flexDirection: 'column'}}>
                                        <View style={{width: '93%',  marginTop: sizeCalculator.height(4), borderRadius: sizeCalculator.convertSize(8), marginBottom: sizeCalculator.height(8)}}>
                                            {/* <Image source={require('./images/mini-player-display.png')} 
                                                style={{position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 8}} /> */}
                                            <Text style={{color: '#939393', fontSize: sizeCalculator.fontSize(18)}}> 
                                                {(this.state.playingMedia) &&
                                                    ' '+this.state.playingMedia.album+''
                                                }
                                            </Text>
                                        </View>
                                        <AudioControls
                                            playing={this.state.play}
                                            mediaType={this.state.mediaType}
                                            controls={this.state.controls} 
                                            onStop={() => this.stopMedia()}
                                            onTogglePlayPause={() => this.togglePlayPause()}
                                            onNextTrack={() => this.nextTrack()}
                                            onPreviousTrack={() => this.previousTrack()}
                                        />
                                    </View>
                                </Fragment>
                            }
                        </View>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

export {
    MediaPlayer, 
    MediaPlayer__Play, 
    MediaPlayer__GetMediaInfo, 
    MediaPlayer__GetVolume, 
    MediaPlayer__SetVolume, 
    MediaPlayer__RegisterOnStop,
    MediaPlayer__RegisterOnNextMedia,
    MediaPlayer__RegisterOnPreviousMedia,
    MediaPlayer__Stop
}