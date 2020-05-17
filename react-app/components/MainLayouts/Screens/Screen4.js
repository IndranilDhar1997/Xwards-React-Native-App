import React, {Fragment, Component} from 'react';
import {MidTile, FullTile, SmallTile, XColumn, BigTile, Screen} from '../../../utility/tile-layouts/XTile';
import DataManager from '../../../service/DataManagerService';

export default class Screen4 extends Component {
    render() {
        return (
            <Screen>
                <XColumn span={1} height='100%'>
                    <MidTile ref={(ref) => DataManager.registerComponent(ref)} componentId={15} type='xplay_video' route={(e, data) => this.props.route(e, data)} />
                    <MidTile 
                        ref={(ref) => DataManager.registerComponent(ref)}
                        static={true}
                        componentId={16} 
                        type='radio' 
                        imgSrc={'https://xwards-storage-production.sgp1.digitaloceanspaces.com/video-photos/92.7fm1-mid.png'}
                        data={{
                            id: 3,
                            name: 'Big FM 92.7',
                            description: '',
                            url: 'http://sc-bb.1.fm:8017',
                            tileSize: 'MidTile',
                            type: "Radio"
                        }}
                        route={(e, data) => this.props.route(e, data)}route={(e, data) => this.props.route(e, data)} />
                </XColumn>
                <XColumn span={1} height='100%'>
                    <FullTile 
                        ref={(ref) => DataManager.registerComponent(ref)}
                        static={true}
                        componentId={17}
                        type='ads' 
                        route={(e, data) => this.props.route(e, data)}
                        imgSrc={require('../../images/ads/big-ad-2-min.jpg')}
                        data={null}
                        />
                </XColumn>
                <XColumn span={1} height='100%'>
                    <SmallTile ref={(ref) => DataManager.registerComponent(ref)} componentId={19} type='news' route={(e, data) => this.props.route(e, data)} />
                    <BigTile componentId={18} 
                        ref={(ref) => DataManager.registerComponent(ref)}
                        static={true}
                        type="TV"
                        imgSrc={'https://xwards-storage-production.sgp1.digitaloceanspaces.com/video-photos/ndtv-tile.jpg'}
                        data={{
                            id: 1,
                            name: 'NDTV India',
                            description: '',
                            url: 'https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/ndtv24x7master.m3u8',
                            player: 'native',
                            tileSize: 'BigTile',
                            type: "TV",
                        }}
                        route={(e, data) => this.props.route(e, data)}
                    />
                </XColumn>
            </Screen>
        )
    }
}