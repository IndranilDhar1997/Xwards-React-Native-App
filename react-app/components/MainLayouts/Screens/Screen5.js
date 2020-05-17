import React, {Component} from 'react';
import {LargeTile, WideTile, XColumn, XRow, MidTile, Screen} from '../../../utility/tile-layouts/XTile';
import DataManager from '../../../service/DataManagerService';

import sizeCalculator from '../../../utility/tile-layouts/sizeCalculator';

export default class Screen5 extends Component {
    render() {
        return (
            <Screen>
                <XColumn span={1} height='100%'>
                    <MidTile ref={(ref) => DataManager.registerComponent(ref)} componentId={20} type='xplay_video' route={(e, data) => this.props.route(e, data)} />
                    <MidTile ref={(ref) => DataManager.registerComponent(ref)} componentId={21} type='xplay_video' route={(e, data) => this.props.route(e, data)} />
                </XColumn>
                <XColumn span={2} height='100%'>
                    <XRow height={sizeCalculator.height(230)}>
                        <WideTile ref={(ref) => DataManager.registerComponent(ref)} componentId={22} type='news' route={(e, data) => this.props.route(e, data)} />
                    </XRow>
                    <XRow height={sizeCalculator.height(460)}>
                        <LargeTile 
                            ref={(ref) => DataManager.registerComponent(ref)}
                            static={true}
                            componentId={23} 
                            type='web-ads' 
                            route={(e, data) => this.props.route(e, data)}
                            imgSrc={require('../../images/ads/play-2048-game.jpeg')}
                            data={{
                                brand: '2048 Board Game',
                                url: 'http://167.71.225.242:7755/',
                                // url:'file:///storage/emulated/0/Xwards/2048/index.html',
                                keyboard: false
                            }}
                        />
                    </XRow>
                </XColumn>
            </Screen>
        )
    }
}