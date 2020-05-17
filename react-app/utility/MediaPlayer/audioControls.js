import React, {Fragment, Component} from 'react';
import { Image, View, TouchableOpacity } from 'react-native'
import sizeCalculator from '../tile-layouts/sizeCalculator';

export default class AudioControls extends Component {
    render() {
        return(
            <View style={{width: '100%', paddingHorizontal: sizeCalculator.width(6), marginBottom: sizeCalculator.height(15), flexDirection: 'row'}}>
                {(this.props.mediaType === 'Radio') ?
                    <Fragment>
                        {this.props.controls.play ? 
                            <TouchableOpacity onPress={() => this.props.onStop()}>
                                <Image source={require('./images/btn-stop.png')} 
                                    style={{width: sizeCalculator.width(60), 
                                        height: sizeCalculator.height(60), 
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(6)}} />
                            </TouchableOpacity>:
                            <TouchableOpacity>
                                <Image source={require('./images/btn-play.png')} 
                                    style={{width: sizeCalculator.width(60), 
                                        height: sizeCalculator.height(60), 
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(6)}} />
                            </TouchableOpacity>
                        }
                    </Fragment>:
                    <Fragment>
                        {this.props.playing ? 
                            <TouchableOpacity onPress={() => this.props.onTogglePlayPause()}>
                                <Image source={require('./images/btn-pause.png')} 
                                    style={{width: sizeCalculator.width(60), 
                                        height: sizeCalculator.height(60), 
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(6)}} />
                            </TouchableOpacity>:
                            <TouchableOpacity onPress={() => this.props.onTogglePlayPause()}>
                                <Image source={require('./images/btn-play.png')} 
                                    style={{width: sizeCalculator.width(60), 
                                        height: sizeCalculator.height(60), 
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(6)}} />
                            </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={() => this.props.onStop()}>
                            <Image source={require('./images/btn-stop.png')} 
                                style={{width: sizeCalculator.width(45), 
                                    height: sizeCalculator.height(45), 
                                    resizeMode: 'contain', 
                                    marginTop: sizeCalculator.height(13.5),
                                    marginLeft: sizeCalculator.width(15)}} />
                        </TouchableOpacity>
                    </Fragment>
                }
                
                {this.props.controls.previousTrack &&
                    <TouchableOpacity onPress={() => this.props.onPreviousTrack()}>
                        <Image source={require('./images/btn-previous.png')} 
                            style={{width: sizeCalculator.width(45), 
                                height: sizeCalculator.height(45), 
                                resizeMode: 'contain', 
                                marginTop: sizeCalculator.height(13.5),
                                marginLeft: sizeCalculator.width(15)}} />
                    </TouchableOpacity>
                }
                {this.props.controls.back &&
                    <TouchableOpacity>
                        <Image source={require('./images/btn-back.png')} 
                            style={{width: sizeCalculator.width(45), 
                                height: sizeCalculator.height(45), 
                                resizeMode: 'contain', 
                                marginTop: sizeCalculator.height(13.5),
                                marginLeft: sizeCalculator.width(15)}} />
                    </TouchableOpacity>
                }
                {(this.props.controls.advance) &&
                    <TouchableOpacity >
                        <Image source={require('./images/btn-forward.png')} 
                            style={{width: sizeCalculator.width(45), 
                                height: sizeCalculator.height(45), 
                                resizeMode: 'contain', 
                                marginTop: sizeCalculator.height(13.5),
                                marginLeft: sizeCalculator.width(15)}} />
                    </TouchableOpacity>
                }
                {(this.props.controls.nextTrack) &&  
                    <TouchableOpacity onPress={() => this.props.onNextTrack()}>
                        <Image source={require('./images/btn-next.png')} 
                            style={{width: sizeCalculator.width(45), 
                                height: sizeCalculator.height(45), 
                                resizeMode: 'contain', 
                                marginTop: sizeCalculator.height(13.5),
                                marginLeft: sizeCalculator.width(15)}} />
                    </TouchableOpacity>
                }
            </View>
        );
    }
}