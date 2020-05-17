import React from 'react';
import { TouchableOpacity } from 'react-native';
import Tiles from './tiles';
import TileImage from './tileImage';

import sizeCalculator from '../../tile-layouts/sizeCalculator';

export default class FullTile extends Tiles {
    
    getTileName() {
        return "FullTile";
    }

    render() {
        return (
            <TouchableOpacity style={{padding: sizeCalculator.convertSize(4), height: sizeCalculator.height(690), width: sizeCalculator.width(426)}} onPress={() => this.onClick()}>
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