import React, {Fragment, Component} from 'react';
import { Text, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';

import sizeCalculator from '../utility/tile-layouts/sizeCalculator';
import ExitModal from '../components/Modals/exit-confirmModal';

export default class LoadingPage extends Component {
    render () {
        return (
            <View style={{backgroundColor: 'white', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 500}}>
                <Image
                    style={{width: '100%', height: '30%', position: 'absolute', bottom: 0, justifyContent: 'space-evenly', overflow: 'hidden'}}
                    source={require('../components/images/background/first-load-background.png')}
                    resizeMode="cover"
                    resizeMethod="resize"
                />
                <TouchableWithoutFeedback onLongPress={()=>this.exitModalRef.showDialog()}>
                    <Image
                        style={{width: '100%', 
                                height: sizeCalculator.height(200), 
                                resizeMode: 'contain', 
                                marginTop: sizeCalculator.height(150),
                                alignSelf: 'center',
                                position: 'absolute'
                            }}
                        source={require('../components/FooterLayout/xds.png')}
                    />
                </TouchableWithoutFeedback>
                <Text style={{fontSize: sizeCalculator.fontSize(24), width: '100%', position: 'absolute', color: '#000', textAlign: 'center', marginTop: sizeCalculator.height(380)}}>
                    LET YOUR CAB RIDE BE MORE ENTERTAINING
                </Text>
                <ExitModal ref={(ref) => {this.exitModalRef=ref}} />
            </View>
        )
    }
}