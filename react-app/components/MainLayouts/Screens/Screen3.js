import React, {Component} from 'react';
import {LargeTile, WideTile, XColumn, XRow, BigTile, Screen, SmallTile} from '../../../utility/tile-layouts/XTile';
import DataManager from '../../../service/DataManagerService';

import sizeCalculator from '../../../utility/tile-layouts/sizeCalculator';

export default class Screen3 extends Component {
    render() {
        return (
            <Screen>
                <XColumn span={1} height='100%'>
                    <SmallTile ref={(ref) => DataManager.registerComponent(ref)} componentId={12} type='news' route={(e, data) => this.props.route(e, data)} />
                    <BigTile ref={(ref) => DataManager.registerComponent(ref)} componentId={11} type='xplay_video' route={(e, data) => this.props.route(e, data)} />
                </XColumn>
                <XColumn span={2} height='100%'>
                    <XRow height={sizeCalculator.height(460)}>
                        <LargeTile 
                            ref={(ref) => DataManager.registerComponent(ref)}
                            static={true}
                            componentId={13} 
                            type='web-ads' 
                            route={(e, data) => this.props.route(e, data)}
                            imgSrc={require('../../images/ads/ad-large-1-min.jpg')}
                            data={{
                                brand: 'Trusted Stay',
                                url: 'https://www.trustedstay.com/mar-contest',
                                keyboard: false
                            }}
                            />
                    </XRow>
                    <XRow height={sizeCalculator.height(230)}>
                        <WideTile ref={(ref) => DataManager.registerComponent(ref)} componentId={14} type='news' route={(e, data) => this.props.route(e, data)} />
                    </XRow>
                </XColumn>
            </Screen>
        )
    }
}