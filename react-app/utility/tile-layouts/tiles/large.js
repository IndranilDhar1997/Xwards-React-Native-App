import React, {Component} from 'react';
import { TouchableOpacity,Image } from 'react-native';
import Tiles from './tiles';
import TileImage from './tileImage';

import sizeCalculator from '../../tile-layouts/sizeCalculator';

export default class LargeTile extends Tiles {
    
    getTileName() {
        return "LargeTile";
    }

    render() {
        return (
            <TouchableOpacity style={{padding: sizeCalculator.convertSize(4), height: sizeCalculator.height(460), width: sizeCalculator.width(852)}} onPress={() => this.onClick()}>
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