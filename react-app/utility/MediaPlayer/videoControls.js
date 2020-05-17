import React, {Fragment, Component} from 'react';
import { Image, View, TouchableOpacity } from 'react-native'
import sizeCalculator from '../tile-layouts/sizeCalculator';

export default class VideoControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            style: {
                width: '100%',
                paddingHorizontal: sizeCalculator.width(6), 
                marginBottom: sizeCalculator.height(7), 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative'
            }
        }
    }

    hideControls() {
        if (!this.props.fullScreen) { //Only allowed in fullscreen
            return false;
        }

        this.setState({style: {
            width: '70%', 
            marginBottom: sizeCalculator.height(7), 
            paddingBottom: sizeCalculator.height(5),
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'absolute',
            bottom: sizeCalculator.height(-1000),
            backgroundColor: 'white',
            borderColor: '#D7D8E2',
            borderWidth: sizeCalculator.convertSize(3)
        }});
    }

    showControls() {
        if (!this.props.fullScreen) { //Only allowed in fullscreen
            return false;
        }

        this.setState({style: {
            width: '70%', 
            marginBottom: sizeCalculator.height(7), 
            paddingBottom: sizeCalculator.height(5),
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'absolute',
            bottom: sizeCalculator.height(20),
            backgroundColor: 'white',
            borderColor: '#D7D8E2',
            borderWidth: sizeCalculator.convertSize(3)
        }});
    }

    toggleFullScreenMode(value) {
        let style = {};
        
        if (value) { //In fullscreen mode
            style = {
                width: '70%', 
                marginBottom: sizeCalculator.height(7), 
                paddingBottom: sizeCalculator.height(5),
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'absolute',
                bottom: sizeCalculator.height(20),
                backgroundColor: 'white',
                borderColor: '#D7D8E2',
                borderWidth: sizeCalculator.convertSize(3)
            }
        } else {
            style = {
                width: '100%',
                paddingHorizontal: sizeCalculator.width(6), 
                marginBottom: sizeCalculator.height(7), 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                borderWidth: 0
            }
        }

        this.setState({style});
    }

    render() {
        return(
            <Fragment>
                {!this.props.disabled &&
                    <View style={this.state.style}>
                        {this.props.controls.previousTrack &&
                            <TouchableOpacity onPress={() => this.props.onPreviousTrack()}>
                                <Image source={require('./images/btn-previous.png')} 
                                    style={{width: sizeCalculator.width(45), 
                                        height: sizeCalculator.height(45),
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(9)}} />
                            </TouchableOpacity>
                        }
                        {this.props.controls.back &&
                            <TouchableOpacity onPress={() => this.props.onBackTrack()}>
                                <Image source={require('./images/btn-back.png')} 
                                    style={{width: sizeCalculator.width(45), 
                                        height: sizeCalculator.height(45),
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(9),
                                        marginLeft: sizeCalculator.width(15)}} />
                            </TouchableOpacity>
                        }

                        {this.props.playing ? 
                            <TouchableOpacity onPress={() => this.props.onTogglePlayPause()}>
                                <Image source={require('./images/btn-pause.png')} 
                                    style={{width: sizeCalculator.width(60), 
                                        height: sizeCalculator.height(60),
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(6),
                                        marginLeft: sizeCalculator.width(15)}} />
                            </TouchableOpacity>:
                            <TouchableOpacity onPress={() => this.props.onTogglePlayPause()}>
                                <Image source={require('./images/btn-play.png')} 
                                    style={{width: sizeCalculator.width(60), 
                                        height: sizeCalculator.height(60),
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(6),
                                        marginLeft: sizeCalculator.width(15)}} />
                            </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={() => this.props.onStop()}>
                            <Image source={require('./images/btn-stop.png')} 
                                style={{width: sizeCalculator.width(45), 
                                    height: sizeCalculator.height(45),
                                    resizeMode: 'contain', 
                                    marginTop: sizeCalculator.height(9),
                                    marginLeft: sizeCalculator.width(15)}} />
                        </TouchableOpacity>

                        {(this.props.controls.advance) &&
                            <TouchableOpacity onPress={() => this.props.onForwardTrack()}>
                                <Image source={require('./images/btn-forward.png')} 
                                    style={{width: sizeCalculator.width(45), 
                                        height: sizeCalculator.height(45),
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(9),
                                        marginLeft: sizeCalculator.width(15)}} />
                            </TouchableOpacity>
                        }
                        {(this.props.controls.nextTrack) &&  
                            <TouchableOpacity onPress={() => this.props.onNextTrack()}>
                                <Image source={require('./images/btn-next.png')} 
                                    style={{width: sizeCalculator.width(45), 
                                        height: sizeCalculator.height(45),
                                        resizeMode: 'contain', 
                                        marginTop: sizeCalculator.height(9),
                                        marginLeft: sizeCalculator.width(15)}} />
                            </TouchableOpacity>
                        }
                    </View>
                }
            </Fragment>
        );
    }
}