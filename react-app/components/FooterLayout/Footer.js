import React, {Component} from 'react';
import { View, Image, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import FooterButton from './Buttons/XButton';
import VolumeSlider from '../../utility/ui/VolumeSlider';
import config from '../../utility/config';
import ExitModal from '../Modals/exit-confirmModal';

import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

import InternetConnectionDialogue from './connection';

export default class Footer extends Component {

    constructor(props) {
        super(props);
        // KioskMode.enable();
        this.state = {
            navigation: this.props.navigation,
            showVolumeSlider: false,
        }
    }

    showVolumeSlider() {
        if (this.state.showVolumeSlider) {
            this.setState({showVolumeSlider: false});
            if (this.volumeBarVisible) {
                clearInterval(this.volumeBarVisible);
                this.volumeBarVisible = null;
            }
        } else {
            this.setState({showVolumeSlider: true});
            this.volumeBarVisible = setInterval(function() {
                this.setState({showVolumeSlider: false});
                clearInterval(this.volumeBarVisible);
                this.volumeBarVisible = null;
            }.bind(this), config.volumeBarDisapper);
        }
    }

    onSlidingComplete() {
        this.setState({showVolumeSlider: false});
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showVolumeSlider && 
                    <VolumeSlider onSlidingComplete={() => this.onSlidingComplete()} volume={this.state.volume} />
                }
                <InternetConnectionDialogue />
                <View style={{
                        position: 'relative', 
                        flexDirection: 'row', 
                       // flex: 110,
                        height: sizeCalculator.height(110), 
                        paddingLeft: sizeCalculator.width(5),
                        paddingRight: sizeCalculator.width(5), 
                        zIndex: 20, 
                        backgroundColor: 'white'
                    }}>
                    <View style={{width: sizeCalculator.width(180), height: '100%', marginTop: sizeCalculator.height(4)}}>
                       <TouchableWithoutFeedback onPress={() => this.props.pageRouting('MainScreen')} onLongPress={()=>this.exitModalRef.showDialog()}>
                            <Image 
                                source={require('./xds.png')} 
                                style={{height: sizeCalculator.height(70), width: '100%', marginTop: sizeCalculator.height(10), marginBottom: sizeCalculator.height(9), resizeMode: 'contain'}} 
                                />
                       </TouchableWithoutFeedback>
                    </View>
                    <View style={{flexDirection: 'row', width: sizeCalculator.width(900), position: 'relative', zIndex: 6}}>
                        <TouchableOpacity style={{
                            position:'relative', 
                            height: '100%', 
                            width: sizeCalculator.width(90), 
                            alignItems: 'center'}} 
                            onPress={() => this.state.navigation.navigate('ScreenOff')}>
                            <Image
                                style={{height: sizeCalculator.height(55), width: sizeCalculator.width(55), resizeMode: 'contain', marginTop: sizeCalculator.height(22)}} 
                                source={require('./Buttons/power.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.showVolumeSlider()} style={{position:'relative', height: '100%', width: sizeCalculator.width(90), alignItems: 'center', marginRight: sizeCalculator.height(20)}}>
                            <Image
                                style={{height: sizeCalculator.height(55), width: sizeCalculator.width(55), resizeMode: 'contain', marginTop: sizeCalculator.height(22)}} 
                                source={require('./Buttons/volume.png')}
                            />
                        </TouchableOpacity>
                        <FooterButton
                            click={() => this.props.pageRouting('Radio')}
                            icon={require('./Buttons/radio.png')}
                            text="Radio"/>
                        {/* <FooterButton
                            click={() => this.props.pageRouting('Music')}
                            icon={require('./Buttons/music.png')}
                            text="Music"/> */}
                        <FooterButton
                            click={() => this.props.pageRouting('News')}
                            icon={require('./Buttons/news.png')}
                            text="News"/>
                        <FooterButton
                            click={() => this.props.pageRouting('Videos')}
                            icon={require('./Buttons/video.png')}
                            text="Videos"/>
                        <FooterButton
                            click={() => this.props.pageRouting('TV')}
                            icon={require('./Buttons/tv.png')}
                            text="Live TV"
                            last={true} />
                    </View>
                </View>
                <ExitModal ref={(ref) => {this.exitModalRef = ref}} />
            </React.Fragment>
        )
    }
}