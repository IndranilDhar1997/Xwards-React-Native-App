import React, {Fragment, Component} from 'react';
import {View, TouchableOpacity, Text } from 'react-native';
import config from '../../utility/config';
import {MediaManager} from '../../utility/MediaPlayer';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class ConfirmModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            backCount: 30,
            showModal: false
        }
    }

    componentDidMount() {
        this.resetSeekForInactivity();
    }

    resetSeekForInactivity() {
        if (this.intervalToShowConfirm) {
            clearTimeout(this.intervalToShowConfirm);
            this.intervalToShowConfirm = null;
        }
        this.intervalToShowConfirm = setTimeout(function() {
            clearTimeout(this.intervalToShowConfirm);
            if (MediaManager.getMedia() !== null || this.props.screen !== 'MainScreen') {
                this.setState({showModal: true});
                this.startTimer();
            }
        }.bind(this), config.resetTimeOnInactivity*60*1000);
    }

    markActive() {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({backCount: 30, showModal: false});
        this.resetSeekForInactivity();
        if ('onActive' in this.props) {
            this.props.onActive();
        }
    }

    startTimer() {
        this.interval = setInterval(function() {
            let backCount = this.state.backCount - 1;
            if (backCount>0) {
                this.setState({backCount: backCount});
            } else {
                clearInterval(this.interval);
                this.onTimerEnd();
            }
        }.bind(this), 1000);
    }

    onTimerEnd() {
        this.setState({showModal: false, backCount: 30});
        MediaManager.stopMedia();
        if ('onExit' in this.props) {
            this.props.onExit();
        }
    }

  	render() {
    	return (
            <Fragment>
                {this.state.showModal && 
                    <View style={{
                        width: '50%',
                        height: sizeCalculator.height(200),
                        backgroundColor: '#fff', 
                        position: 'absolute', 
                        top: '50%',
                        left: '25%', 
                        marginTop: sizeCalculator.height(-100), 
                        zIndex: 120,
                        alignItems: 'center',
                        borderColor: '#232b62',
                        borderWidth: sizeCalculator.convertSize(4)
                    }}>
                        <Text style={{color: '#000', padding: sizeCalculator.convertSize(17), textAlign: 'center', fontSize: sizeCalculator.fontSize(22)}}>
                            Are you still using the device? The device will close all media in {this.state.backCount} seconds.
                        </Text>
                        <TouchableOpacity onPress={() => this.markActive()} 
                            style={{backgroundColor: '#0350a4', width: sizeCalculator.width(240), padding: sizeCalculator.convertSize(10), marginTop: sizeCalculator.height(10)}}>
                            <Text style={{fontSize: sizeCalculator.fontSize(17), textAlign: 'center', color: '#fff'}}>Continue Watching</Text>
                        </TouchableOpacity>
                    </View>
                }
            </Fragment>
		);
	}
};