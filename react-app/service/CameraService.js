import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import config from '../utility/config';

//Styles for Camera
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

export default class CameraService extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            camera: null,
            faceAvailable: false
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ faceAvailable: false });
        }, config.faceAvailabilityTimeout*60*1000);
    }

    startCamera(x) {
        this.cameraRef.resumePreview();
    }

    handleFaceDetection(faceData) {
        console.log(faceData);
        if( faceData !== null || faceData!== undefined || faceData!== {} ) {
            this.setState({ faceAvailable : true });
        } else {
            this.setState({ faceAvailable: false });
        }
    }

    isFaceAvailable = () => {
        return this.state.faceAvailable;
    }

    render() { 
        return ( 
            <View style={styles.container} >
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.front}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Allow',
                        buttonNegative: 'Deny',
                    }}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Landmarks.all}
                    onFacesDetected={(x) => this.handleFaceDetection(x)}
                    onCameraReady={(x) => this.startCamera(x)}
                    ref={ref => {{this.cameraRef = ref }}}
                />
            </View>
        );
    }
}