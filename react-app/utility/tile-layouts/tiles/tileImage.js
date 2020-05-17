import React, {Component, Fragment} from 'react';
import { Image, View } from 'react-native';
import { Bubbles } from 'react-native-loader';

import sizeCalculator from '../../tile-layouts/sizeCalculator';

export default class TileImage extends Component {
    constructor(props) {
        super(props);
        let style = {width: '100%', height: '100%', resizeMode: 'contain'};
        let tileSize = false;
        if ('tileSize' in this.props) {
            switch (this.props.tileSize) {
                case 'SmallTile':
                    style = {width: '100%', height: '100%', resizeMode: 'cover', position: 'absolute', top: sizeCalculator.height(4), left: sizeCalculator.width(4)};
                    break;
                case 'WideTile':
                    style = {width: '40%', height: '100%', resizeMode: 'cover'};
                    break;
                default:
                    if (sizeCalculator.isStandardDevice()) {
                        style = {width: '100%', height: '100%'};
                    } else {
                        style = {width: '100%', height: '100%', resizeMode: 'stretch'};
                    }
                    break;
            }
        }
        this.state = {
            loading: false,
            style: style,
            tileSize: tileSize
        }
    }

    onLoadStart() {
        this.setState({loading: true});
    }

    onLoadSuccess() {
        this.setState({loading: false});
    }

    onLoadError() {
        this.setState({loading: false, ImgSrc: require('../../../components/images/icons/error.png'), style: {width: '40%', height: '40%'}});
    }

    render() {
        return (
            <Fragment>
                {(this.state.loading) && 
                    <View style={{position: 'absolute', top: '50%', left: '50%', marginLeft: sizeCalculator.width(-35), marginTop: sizeCalculator.height(-10), zIndex: 20}}>
                        <Bubbles size={sizeCalculator.convertSize(10)} color="#000" spaceBetween={sizeCalculator.width(5)} />
                    </View>
                }
                <Image
                    onLoadStart={() => this.onLoadStart()}
                    onLoad={() => this.onLoadSuccess()}
                    style={this.state.style}
                    progressiveRenderingEnabled={true}
                    source={(typeof this.props.ImageSrc === 'string') ? {uri: this.props.ImageSrc} : ((typeof this.props.ImageSrc === 'number') ? this.props.ImageSrc : require('../../../components/images/icons/error.png'))}
                />
            </Fragment>
        )
    }
}