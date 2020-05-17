import React, {Fragment, Component} from 'react';
import { Text, View, Image, TouchableWithoutFeedback, PermissionsAndroid } from 'react-native';

import sizeCalculator from '../utility/tile-layouts/sizeCalculator';
import ExitModal from '../components/Modals/exit-confirmModal';


import RNRestart from 'react-native-restart';

export default class PermissionsPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.askPermission();
    }

    askPermission() {
        this.checkPermissions().then(function () {
            console.log('All Permissions are now given');
            RNRestart.Restart();
        }.bind(this)).catch(function (e) {
            var _this = this;
            PermissionsAndroid.request(e).then(granted => {
                console.log('Permission Granted', granted);
                _this.askPermission();
            }).catch(function() {
                console.log('Permission Not Granted');
                _this.askPermission();
            });
        }.bind(this))
    }

    checkPermissions() {
		return new Promise(function(resolve, reject) {
			PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION').then(function (bool) {
				if (!bool) {
					return reject('android.permission.ACCESS_FINE_LOCATION');
				}
				PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE').then(function (bool) {
					if (!bool) {
						return reject('android.permission.WRITE_EXTERNAL_STORAGE');
					}
					PermissionsAndroid.check('android.permission.READ_EXTERNAL_STORAGE').then(function (bool) {
						if (!bool) {
							return reject('android.permission.READ_EXTERNAL_STORAGE');
						}
						return resolve();	
					});	
				});
			});
		})
	}

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
                    REQUIRED PERMISSIONS ARE NOT GIVEN TO THE APP
                </Text>
                <ExitModal ref={(ref) => {this.exitModalRef=ref}} />
            </View>
        )
    }
}