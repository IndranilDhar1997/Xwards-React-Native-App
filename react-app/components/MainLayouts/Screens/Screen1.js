import React, {Component} from 'react';
import {MidTile, WideTile, XColumn, XRow, BigTile, Screen} from '../../../utility/tile-layouts/XTile';
import DataManager from '../../../service/DataManagerService';

import sizeCalculator from '../../../utility/tile-layouts/sizeCalculator';

export default class Screen1 extends Component {

    render() {
        return (
            <Screen>
                <XColumn span={1} height='100%'>
                    <MidTile ref={(ref) => DataManager.registerComponent(ref)} componentId={1} type="xplay_video" route={(e, data) => this.props.route(e, data)} />
                    <MidTile ref={(ref) => DataManager.registerComponent(ref)} componentId={2} type="xplay_video" route={(e, data) => this.props.route(e, data)} />
                </XColumn>
                <XColumn span={2} height='100%'>
                    <XRow height={sizeCalculator.height(230)}>
                        <WideTile ref={(ref) => DataManager.registerComponent(ref)} componentId={5} type="news" route={(e, data) => this.props.route(e, data)} />
                    </XRow>
                    <XRow height={sizeCalculator.height(460)}>
                        <BigTile ref={(ref) => DataManager.registerComponent(ref)} componentId={3} type="xplay_video" route={(e, data) => this.props.route(e, data)} />
                        <BigTile componentId={4} 
                            ref={(ref) => DataManager.registerComponent(ref)}
                            type="TV"
                            static={true}
                            imgSrc={'https://xwards-storage-production.sgp1.digitaloceanspaces.com/video-photos/india-tv-tile.jpg'}
                            data={{
                                id: 4,
                                name: 'India TV News',
                                description: '',
                                tileSize: 'BigTile',
                                type: "TV",
                                url: 'https://live-indiatvnews.akamaized.net/indiatv-origin/liveabr/playlist.m3u8',
                                player: 'native'
                            }}
                            route={(e, data) => this.props.route(e, data)}
                        />
                    </XRow>
                </XColumn>
            </Screen>
        )
    }
}