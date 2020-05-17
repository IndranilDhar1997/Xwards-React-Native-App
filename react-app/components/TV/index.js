import React, {Fragment, Component} from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import TVList from './TVList';

import {MediaManager} from '../../utility/MediaPlayer';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class TVListHolder extends Component {

    constructor(props) {
        super(props);
        let TVChannels = [];
        let TVRow = true;
        let TVListArr = []
        
        //Build the TV output array
        TVList.map(function(tv) {
            if (TVRow) {
                TVListArr = [];
            }
            TVListArr.push(tv);
            TVRow = false;
            if (TVListArr.length >= 3) {
                TVChannels.push(TVListArr);
                TVListArr = [];
                TVRow = true;
            }
        });

        let playingTV = MediaManager.getMedia();

        if (playingTV !== null) {
            if (playingTV.type === 'TV') {
                playingTV = TVList.filter(tv => {
                    if (playingTV.id === tv.id) return tv;
                });
                playingTV = playingTV[0];
            } else {
                playingTV = null;
            }
        }

        if (TVListArr.length > 0 ){
            TVChannels.push(TVListArr);
        }

        this.state = {
            tvList: TVChannels,
            playingTV: playingTV
        }
    }

    componentDidMount() {
        let playingTV = MediaManager.getMedia();
        if (playingTV && playingTV.type === 'TV') {
            this.onPlayStart(playingTV);
        }
    }

    onPlayStart(playingTV) {
        MediaManager.onNextMedia(function() {
            let playingTVId = playingTV.id;
            if (playingTVId+1 > TVList.length) {
                playingTVId = 1;
            } else {
                playingTVId++;
            }

            this.playTV(TVList[playingTVId-1]);

        }.bind(this));

        MediaManager.onPreviousTrack(function() {
            let playingTVId = playingTV.id;
            if (playingTVId-1 < 1) {
                playingTVId = TVList.length;
            } else {
                playingTVId--;
            }

            this.playTV(TVList[playingTVId-1]);

        }.bind(this));
    }

    playTV(tv) {
        let playingTV = tv;
        this.setState({playingTV: playingTV});

        if (/*playingTV !== null && */typeof playingTV.url === 'function') {
            playingTV.url().then(url => {
                playingTV.url = url;
                playingTV = MediaManager.buildtrack('TV', playingTV);
                MediaManager.playTV(playingTV, function() {
                    this.onPlayStart(playingTV);
                }.bind(this));
            }).catch(e => {
                console.log(e);
            })
        } else {
            playingTV = MediaManager.buildtrack('TV', playingTV);
            MediaManager.playTV(playingTV, function() {
                this.onPlayStart(playingTV);
            }.bind(this));
        }
    }

    render() {
        return (
            <Fragment>
            {this.state.tvList.map((list, key) => {
                return (
                    <View key={key} style={{width: '100%', flexDirection: 'row', paddingLeft: sizeCalculator.width(50)}}>
                        {list.map(TV => {
                            return (
                            <TouchableOpacity onPress={() => this.playTV(TV)} key={TV.id} style={{padding: sizeCalculator.convertSize(25), height: sizeCalculator.height(350), width: sizeCalculator.width(350), alignSelf: 'center', position: 'relative'}}>
                                <Image
                                    style={{width: '100%', height: '100%'}}
                                    source={TV.thumbnail}
                                />
                            </TouchableOpacity>
                            )
                        })}
                    </View>
                )
            })}
            </Fragment>
        )
    }
}