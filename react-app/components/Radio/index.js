import React, {Fragment, Component} from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import RadioList from './RadioList';
import RadioThumbnail from './radioThumbnail';

import {MediaManager} from '../../utility/MediaPlayer';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class RadioListHolder extends Component {

    constructor(props) {
        super(props);
        let radioChannels = [];
        let radioRow = true;
        let radioListArr = [];
        
        //Build the radio output array
        RadioList.map(function(radio) {
            if (radioRow) {
                radioListArr = [];
            }
            radioListArr.push(radio);
            radioRow = false;
            if (radioListArr.length >= 3) {
                radioChannels.push(radioListArr);
                radioListArr = [];
                radioRow = true;
            }
        });

        let playingRadio = MediaManager.getMedia();
        
        if (playingRadio !== null) {
            if (playingRadio.type === 'Radio') {
                playingRadio = RadioList.find(radio => {
                    if (parseInt(playingRadio.id) === radio.id) return radio;
                });
                //playingRadio = playingRadio[0];
            } else {
                playingRadio = null;
            }
        }

        if (radioListArr.length > 0 ){
            radioChannels.push(radioListArr);
        }

        this.state = {
            radioList: radioChannels,
            playingRadio: playingRadio
        }

        this.RadioRefs = [];
        this.unmounted = false;
    }

    componentDidMount() {
        let playingRadio = MediaManager.getMedia();
        if (playingRadio && playingRadio.type === 'Radio') {
            this.updatePlaying(playingRadio);
        }
    }

    componentWillUnmount() {
        this.updatePlayer = null;
    }

    updatePlaying(playingRadio) {
        MediaManager.onNextMedia(function() {
            let currentRadioId = playingRadio.id;
            if (currentRadioId+1 > RadioList.length) {
                currentRadioId = 1;
            } else {
                currentRadioId++;
            }

            //Find this radio in refs.
            let radio = this.RadioRefs.find(function(refs) {
                if (refs.radio.id === currentRadioId) {
                    return refs;
                }
            });
            
            radio.ref.playRadio(radio.radio);
            this.setState({ playingRadio: radio.radio });
        }.bind(this));

        MediaManager.onPreviousTrack(function() {
            let currentRadioId = playingRadio.id;
            if (currentRadioId-1 < 1) {
                currentRadioId = RadioList.length;
            } else {
                currentRadioId--;
            }

            //Find this radio in refs.
            let radio = this.RadioRefs.find(function(refs) {
                if (refs.radio.id === currentRadioId) {
                    return refs;
                }
            });

            radio.ref.playRadio(radio.radio);
            this.setState({ playingRadio: radio.radio });
        }.bind(this));

        this.setState({playingRadio: playingRadio});
    }

    render() {
        return (
            <Fragment>
            {this.state.radioList.map((list, key) => {
                return (
                    <View key={key} style={{width: '100%', flexDirection: 'row', paddingHorizontal:sizeCalculator.width(50), alignContent: 'center'}}>
                        {list.map(radio => {
                            return (
                                <RadioThumbnail   
                                    ref={(ref) => this.RadioRefs.push({ref:ref, radio: radio })}                      
                                    key={radio.id} 
                                    current={this.state.playingRadio} 
                                    radio={radio} 
                                    onPlaying={(playingRadio) => this.updatePlaying(playingRadio)}/>
                            )
                        })}
                    </View>
                )
            })}
            </Fragment>
        )
    }
}