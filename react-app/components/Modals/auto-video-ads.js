import React, {Fragment, Component} from 'react';
import {View, TouchableOpacity, Text } from 'react-native';
import config from '../../utility/config';
import {MediaManager} from '../../utility/MediaPlayer';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';
import AdsManager from '../../service/AdsManager';
import Video from 'react-native-video';
import LoggingService from '../../service/LoggingService'; 

export default class AutoVideoAds extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playAutoAds: false,
            onlyLocal: true,
            adURL: null,
            videoAdDetail: null
        }
    }

    componentDidMount() {
        this.playAutoVideoAds();
    }

    playAutoVideoAds() {
        if (this.intervalToShowConfirm) {
            clearTimeout(this.intervalToShowConfirm);
            this.intervalToShowConfirm = null;
            this.setState({playAutoAds: false, adURL: null, videoAdDetail: null});
        }

        //This function will run after mentioned time.
        this.intervalToShowConfirm = setTimeout(function() {
            clearTimeout(this.intervalToShowConfirm);
            this.intervalToShowConfirm = null;
            this.runAds();        
        }.bind(this), config.playAutoVideoAds*60*1000);
        
    }

    runAds() {
        //There is no Media player playing anything and is on Main Screen
        if(!this.props.camera().isFaceAvailable()) {
            this.markActive();
            return false;
        }
        console.log(this.props.camera().isFaceAvailable());
        if((MediaManager.getMedia() === null && this.props.screen === 'MainScreen') && (this.props.camera().isFaceAvailable())) {
            AdsManager.nextVideoAds(this.state.onlyLocal).then(function(autoVideoAds) {
                this.setState({ adURL: autoVideoAds.local_url, videoAdDetail: autoVideoAds, playAutoAds: true});
            }.bind(this));
        }
    }

    markActive() {
        this.setState({playAutoAds: false, adURL: null, videoAdDetail: null });
        this.playAutoVideoAds();
    }

    onAdEnd() {
        AdsManager.markImpression(this.state.videoAdDetail).then((response)=> {
            console.log(this.state.videoAdDetail);
            //Building logs for this Ad.
            var log_url = this.state.videoAdDetail.remote_url.split('/');
            var file = log_url.pop() || log_url.pop();
            let videoDataToSend = {
                id: this.state.videoAdDetail.campaign_id,
                fileName: file.toUpperCase()
            }
            LoggingService.log({
                type: 'VIDEOADS',
                action: 'VideoAdsPlaying',
                data: videoDataToSend
            });

            if(!this.props.camera().isFaceAvailable()) {
                this.markActive();
                return false;
            }

            //Fetch new Ads
            AdsManager.nextVideoAds(this.state.onlyLocal).then(function(autoVideoAds) {
                this.setState({ adURL: autoVideoAds.local_url, videoAdDetail: autoVideoAds});
            }.bind(this)).catch(e=> {
                console.log(e);
            });
        }).catch(e=> {
            console.log(e);
        })
    }

    render() {
    	return (            
            <Fragment>
                {(this.state.playAutoAds && this.state.adURL !== null) &&
                    <View style={{
                            position: 'absolute',
                           // top: sizeCalculator.height(10),
                            width: '100%',
                            height: '100%',
                            zIndex: 15,
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity onPress={()=>this.markActive()}
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{
                                position: 'absolute', 
                                zIndex: 20, 
                                alignSelf: 'center',
                                justifyContent: 'center',
                                width: 'auto',
                                height: sizeCalculator.height(50),
                                fontSize: sizeCalculator.fontSize(23),
                                textAlign: 'center',
                                color: '#ccc', 
                                backgroundColor: '#33333345', 
                                padding: 5
                            }}>TAP TO CLOSE THE VIDEO</Text>
                            <Video source={{uri: this.state.adURL}}
                                style={{
                                    flex:1,
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                    width: '100%',
                                    height: '100%',
                                    marginBottom: sizeCalculator.height(79)
                                }}
                                volume={0}
                                resizeMode='contain'
                                paused={false}
                                onEnd={() => this.onAdEnd()}
                            />
                        </TouchableOpacity>
                    </View>
                }
            </Fragment>  
		);
	}
}