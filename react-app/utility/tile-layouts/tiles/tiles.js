import Logger from '../../Logger';

import RadioList from '../../../components/Radio/RadioList';
import {MediaManager} from '../../MediaPlayer';

export default class Tiles extends Logger {

    constructor(props) {
        super(props);
        let ImgSrc = this.props.imgSrc || null;
        let data = this.props.data || null;
        this.state = {
            id: this.props.componentId,
            ImageSrc: ImgSrc,
            ContentType: this.props.type,
            Data: data,
            mediaLoading: false,
            mediaPlaying: false,
        }
    }

    componentDidMount() {
        this.loadImages = function(data) {
            let ImgSrc = null;
            switch (this.getTileName()) {
                case 'BigTile':
                    ImgSrc = data.imgBig;
                    break;
                case 'FullTile':
                    ImgSrc = data.imgFull;
                    break;
                case 'LargeTile':
                    ImgSrc = data.imgLarge;
                    break;
                case 'MidTile':
                    ImgSrc = data.imgMid;
                    break;
                case 'SmallTile':
                    if (typeof data.imgSmall === 'string' && data.imgSmall.length < 2) {
                        return;
                    }
                    ImgSrc = data.imgSmall;
                    break;
                case 'WideTile':
                    if (typeof data.imgWide === 'string' && data.imgWide.length < 2) {
                        return;
                    }
                    ImgSrc = data.imgWide;
                    break;
            }
            data.tileSize = this.getTileName();
            this.setState({
                ImageSrc: ImgSrc,
                Data: data,
                mediaLoading: false,
                mediaPlaying: false,
            });
        }.bind(this);
    }
    
    componentWillUnmount() {
        // console.log(`Unmounting component ${this.state.id} of type ${this.getTileName()}`)
        this.loadImages = null;
    }
    
    onClick() {
        if (this.state.Data === null) {
            return;
        }

        let data = this.state.Data;

        if (!('type' in data)) {
            data.type = this.props.type;
        }

        let Log = {
            type: 'Tile',
            action: 'Click',
            data: data
        }

        switch (data.type) {
            case 'news':
                let newsData = Object.create(this.state.Data);
                newsData.coverImg = ('imgWide' in this.state.Data) ? this.state.Data.imgWide : ( ('imgSmall' in this.state.Data) ? this.state.Data.imgSmall : ( ('coverImg' in this.state.Data) ? this.state.Data.coverImg : '' ) );
                this.props.route({data: newsData, pageName: 'ReadingSection'});
                break;
            case 'xplay':
                this.setState({mediaLoading: true});

                let playingVideo = MediaManager.buildtrack('XPlay', {
                    id: this.state.Data.id,
                    neo_id: this.state.Data.neo_id,
                    content_url: this.state.Data.content_url,
                    title: this.state.Data.videoTitle,
                    player: 'native',
                    keywords: this.state.Data.keywords
                });
                
                MediaManager.playVideo(playingVideo, function() {
                    this.setState({mediaLoading: false, mediaPlaying: true});
                }.bind(this));

                //this.props.route({data: this.state.Data.channelId, pageName: 'Videos'});

                break;
            case 'TV':
                this.setState({mediaLoading: true});

                let playingTV = this.state.Data;
                if (playingTV !== null && typeof playingTV.url === 'function') {
                    playingTV.url().then(url => {
                        playingTV.url = url;
                        playingTV = MediaManager.buildtrack('TV', playingTV);
                        MediaManager.playTV(playingTV, function() {
                            this.setState({mediaLoading: false, mediaPlaying: true});
                        }.bind(this));
                    }).catch(e => {
                        console.log(e);
                    })
                } else {
                    playingTV = MediaManager.buildtrack('TV', playingTV);
                    MediaManager.playTV(playingTV, function() {
                        this.setState({mediaLoading: false, mediaPlaying: true});
                    }.bind(this));
                }
                this.props.route({data: null, pageName: 'TV'});
                break;
            case 'Radio':
                this.setState({mediaLoading: true});
                let playingRadioId = this.state.Data.id;
                
                let playingRadio = RadioList.find(function(radio) {
                    if (radio.id === playingRadioId) {
                        return radio;
                    }
                }.bind(this));

                playingRadio = MediaManager.buildtrack('Radio', playingRadio);
                
                MediaManager.playRadio(playingRadio, function() {
                    this.setState({mediaLoading: false, mediaPlaying: true});
                }.bind(this));
                break;
            case 'web-ads':
                this.props.route({data: data, pageName: 'WebAds'});
                break;
        }
    }

    loadData(data) {
        if (typeof this.loadImages === 'function') {
            this.loadImages(data);
        }
    }

    unregisterMediaEvents = function() {
        this.setState({mediaLoading: false, mediaPlaying: false});
    }
}