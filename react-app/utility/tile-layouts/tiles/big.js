import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Tiles from './tiles';
import TileImage from './tileImage';

import { Bars, Bubbles } from 'react-native-loader';

import sizeCalculator from '../../tile-layouts/sizeCalculator';

export default class BigTile extends Tiles {

    getTileName() {
        return "BigTile";
    }

    render() {
        return (
            <TouchableOpacity style={{padding: sizeCalculator.convertSize(4), height: sizeCalculator.height(460), width: sizeCalculator.width(426)}} onPress={() => this.onClick()}>
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
                {(this.state.ImageSrc !== null) && 
                    <TileImage 
                        id={this.state.id}
                        ImageSrc={this.state.ImageSrc} 
                        tileSize={this.getTileName()} />
                }
            </TouchableOpacity>
        )
    }
}