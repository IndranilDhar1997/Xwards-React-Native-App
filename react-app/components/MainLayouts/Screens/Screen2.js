import React, {Fragment, Component} from 'react';
import {MidTile, FullTile, SmallTile, XColumn, BigTile, Screen} from '../../../utility/tile-layouts/XTile';
import DataManager from '../../../service/DataManagerService';

export default class Screen2 extends Component {
    render() {
        return (
            <Screen>
                <XColumn span={1} height='100%'>
                    <FullTile 
                        ref={(ref) => DataManager.registerComponent(ref)}
                        componentId={6} 
                        type='web-ads' 
                        static={true}
                        route={(e, data) => this.props.route(e, data)} 
                        imgSrc={require('../../images/ads/big-ad-head-held-high.jpg')}
                        data={{
                            brand: 'Head Held High',
                            url: 'https://xwards-storage.sgp1.digitaloceanspaces.com/qr-code-head-held-high.jpg',
                            keyboard: false
                        }}
                    />
                </XColumn>
                <XColumn span={1} height='100%'>
                    <MidTile ref={(ref) => DataManager.registerComponent(ref)} componentId={7} type='xplay_video' route={(e, data) => this.props.route(e, data)} />
                    <MidTile 
                        ref={(ref) => DataManager.registerComponent(ref)}
                        static={true}
                        componentId={8} 
                        type='radio' 
                        imgSrc={'https://xwards-storage-production.sgp1.digitaloceanspaces.com/video-photos/social-mob.png'}
                        data={{
                            id: 1,
                            name: 'SocialMob',
                            description: '',
                            url: 'https://stream.socialmob.me/s0891ae4f2/listen',
                            tileSize: 'MidTile',
                            type: "Radio"
                        }}
                        route={(e, data) => this.props.route(e, data)}route={(e, data) => this.props.route(e, data)} />
                </XColumn>
                <XColumn span={1} height='100%'>
                    <SmallTile ref={(ref) => DataManager.registerComponent(ref)} componentId={9} type='news' route={(e, data) => this.props.route(e, data)} />
                    <BigTile ref={(ref) => DataManager.registerComponent(ref)} componentId={10} type='xplay_video' route={(e, data) => this.props.route(e, data)} />
                </XColumn>
            </Screen>
        )
    }
}