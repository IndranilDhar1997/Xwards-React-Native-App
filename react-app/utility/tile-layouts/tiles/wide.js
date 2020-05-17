import React, {Fragment} from 'react';
import { TouchableOpacity,Image, View, Text } from 'react-native';
import Tiles from './tiles';
import TileImage from './tileImage';

import { Bars, Bubbles } from 'react-native-loader';

import sizeCalculator from '../../tile-layouts/sizeCalculator';

export default class WideTile extends Tiles {

    getTileName() {
        return "WideTile";
    }

    render() {
        return (
            <TouchableOpacity style={{flex: 1, flexDirection: 'row', padding: sizeCalculator.convertSize(4), height: sizeCalculator.height(230), width: sizeCalculator.width(852)}} onPress={() => this.onClick()}>
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
                        <View style={{backgroundColor: 'white', width: '60%', position: 'relative'}}>
                            <Image
                                style={{width: '100%', height: '100%'}} 
                                source={require('../../../components/images/background/wideGradiant.jpg')}
                            />
                            <Text style={{position: 'absolute', top: 0, width: '100%', height: '100%', fontSize: sizeCalculator.fontSize(28), color: 'white', padding: sizeCalculator.convertSize(10)}}>
                                {this.state.Data.contentTitle}
                            </Text>
                            <Text style={{position: 'absolute', bottom: 0, right: 0, fontSize: sizeCalculator.fontSize(15), color: 'white', padding: sizeCalculator.convertSize(10)}}>
                                Read More
                            </Text>
                        </View>
                        {this.state.ImageSrc && 
                            <TileImage 
                                id={this.state.id}
                                ImageSrc={this.state.ImageSrc} 
                                tileSize={this.getTileName()} />
                        }
                    </Fragment>
                }
            </TouchableOpacity>
        )
    }
}