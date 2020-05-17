import React, {Component} from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import VideoService from '../../service/VideoService';
import ChannelSquare from './ChannelSquare';
import VideoList from './VideoList';

import {MediaManager} from '../../utility/MediaPlayer';
import { Bubbles } from 'react-native-loader';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class VideoPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channels: VideoService.getChannels(),
            videos: [],
            selectedChannel: (('channelId' in this.props && this.props.channelId) ? this.props.channelId : VideoService.getChannels()[0]),
            playingVideo: null
        };
    }

    componentDidMount() {
        let channels = this.state.channels;
        if (channels.length > 0) {
            if ('channelId' in this.props && this.props.channelId) {
                this.onChannelSelect(this.props.channelId);
            } else {
                this.onChannelSelect(channels[0].id);
            }
        }
    }

    onChannelSelect(channelId) {
        VideoService.getChannelById(channelId).then(function (selectedChannel) {
            let _this = this;
            VideoService.getVideosForChannel(channelId).then(function (videos) {
                _this.setState({
                    channels: VideoService.getChannels(),
                    videos: videos,
                    selectedChannel: selectedChannel,
                    playingVideo: null
                });
            }.bind(_this));
        }.bind(this));
    }

    playVideo(video) {
        let playingVideo = (this.state.playingVideo === null)? video : ((this.state.playingVideo.id === video.id)? null : video);
        this.setState({playingVideo: playingVideo});
        playingVideo = MediaManager.buildtrack('Video', playingVideo);
        MediaManager.playVideo(playingVideo);
    }

  	render() {
    	return (
            <React.Fragment>
                {(!this.state) && 
                    <View style={{position: 'absolute', top: sizeCalculator.height(330), left: sizeCalculator.width(560)}}>
                        <Bubbles size={sizeCalculator.convertSize(30)} color="#FFF" spaceBetween={sizeCalculator.width(10)} />
                    </View>
                }
                {this.state && 
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 50, marginTop: sizeCalculator.height(20), width: '50%'}}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
                                <View style={{width: '100%', flexWrap: 'wrap', flexDirection:'row'}}>
                                    {this.state.channels.map(channel => {
                                        return (
                                            <ChannelSquare key={channel.id} icon={channel.icon} onClick={() => this.onChannelSelect(channel.id)} />
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{flex: 50, marginTop: sizeCalculator.height(20), width: '50%'}}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
                                {this.state.selectedChannel &&
                                    <View style={{width: '100%', height: sizeCalculator.height(160), marginBottom: sizeCalculator.height(75), position: 'relative'}}>
                                        <Image
                                            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                                            source={{uri: this.state.selectedChannel.cover}}
                                        />
                                        <Image
                                            style={{width: sizeCalculator.width(130), height: sizeCalculator.height(130), resizeMode: 'cover', position: 'absolute', bottom: sizeCalculator.height(-15), left: sizeCalculator.width(15), borderColor: 'white', borderWidth: sizeCalculator.width(3), borderRadius: sizeCalculator.width(8) }}
                                            source={{uri: this.state.selectedChannel.icon}}
                                        />
                                        <Text style={{
                                            fontWeight: '100', 
                                            fontFamily: 'Montserrat-Light',
                                            textAlign: 'left',
                                            fontSize: sizeCalculator.fontSize(23),
                                            textAlignVertical: 'center', 
                                            color: '#fff', paddingTop: sizeCalculator.height(5),
                                            padding: sizeCalculator.convertSize(8),
                                            flexWrap: 'wrap',
                                            marginTop: sizeCalculator.height(15),
                                        }}>
                                            {this.state.selectedChannel.name}
                                        </Text>
                                    </View>
                                }
                                <View style={{width: '100%', flexWrap: 'wrap', flexDirection:'column'}}>
                                    {this.state.videos.map(video => {
                                        return (
                                            <VideoList key={video.id} title={video.title} thumbnail={video.thumbnail} onClick={() => this.playVideo(video)} />
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                }
            </React.Fragment>
		);
	}
};