import React, {Fragment} from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import Tiles from './tiles';
import TileImage from './tileImage';

import { Bars, Bubbles } from 'react-native-loader';

import sizeCalculator from '../../tile-layouts/sizeCalculator';

export default class SmallTile extends Tiles {

    getTileName() {
        return "SmallTile";
    }

    render() {
        return (
            <TouchableOpacity style={{padding: sizeCalculator.convertSize(4), height: sizeCalculator.height(230), width: sizeCalculator.width(426), position: 'relative'}} onPress={() => this.onClick()}>
                {(this.state.mediaPlaying) && 
                    <View style={{position: 'absolute', width: '100%', bottom: sizeCalculator.height(20), paddingRight: sizeCalculator.width(20), alignItems: 'flex-end', zIndex: 12}}>
                        <Bars size={sizeCalculator.convertSize(20)} color="#fff" spaceBetween={sizeCalculator.width(5)} />
                    </View>
                }
                {(this.state.mediaLoading) && 
                    <View style={{position: 'absolute', width: '100%', bottom: sizeCalculator.height(20), paddingRight: sizeCalculator.width(20), alignItems: 'flex-end', zIndex: 12}}>
                        <Bubbles size={sizeCalculator.height(10)} color="#fff" spaceBetween={sizeCalculator.width(10)} />
                    </View>
                }
                {(this.state.Data !== null) && 
                    <Fragment>
                        {this.state.ImageSrc && 
                            <TileImage 
                                id={this.state.id}
                                ImageSrc={this.state.ImageSrc} 
                                tileSize={this.getTileName()} />
                        }
                        <Image
                            style={{width: '100%', height: '100%', opacity: 0.75}} 
                            source={require('../../../components/images/background/smallGradient.jpg')}
                        />
                        <Text style={{position: 'absolute', top: sizeCalculator.height(4), left: sizeCalculator.width(4), width: '100%', height: '100%', fontSize: sizeCalculator.fontSize(25), color: 'white', padding: sizeCalculator.convertSize(8)}}>
                            {this.state.Data.contentTitle}
                        </Text>
                        <Text style={{position: 'absolute', bottom: sizeCalculator.height(8), right: sizeCalculator.width(8), fontSize: sizeCalculator.fontSize(15), color: 'white', padding: sizeCalculator.convertSize(10)}}>
                            Read More
                        </Text>
                    </Fragment>
                }
            </TouchableOpacity>
        )
    }
}