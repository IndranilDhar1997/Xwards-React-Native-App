import React, {Component} from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class NewsTile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logoHeight: sizeCalculator.height(30),
            logoWidth: sizeCalculator.width(100)
        }
    }

    componentDidMount() {
        Image.getSize(this.props.partnerLogo, function (srcWidth, srcHeight) {
            srcWidth = parseFloat((this.state.logoHeight*srcWidth)/srcHeight);
            this.setState({logoWidth: srcWidth});
        }.bind(this));
    }

  	render() {
    	return (
            <TouchableOpacity onPress={this.props.onClick} style={{marginTop: sizeCalculator.height(20), 
            width: sizeCalculator.width(330), height: sizeCalculator.height(280), marginLeft: sizeCalculator.convertSize(15), marginRight: sizeCalculator.convertSize(15), backgroundColor: 'white',
            position: 'relative', borderRadius: 0}}>
                <Image
                    style={{width: '100%', height: '100%'}}
                    source={{uri: this.props.imgSrc}}
                />
                <View style={{backgroundColor: 'white', position: 'absolute', top: sizeCalculator.height(5), left: sizeCalculator.width(4), padding: sizeCalculator.convertSize(5)}}>
                <Image
                    style={{ height: this.state.logoHeight, width: this.state.logoWidth, alignContent: 'flex-start' }}
                    source={{uri: this.props.partnerLogo}}
                    resizeMode="contain"
                />
                </View>
                <View style={{position: 'absolute', 
                        bottom: 0,
                        alignContent: 'flex-start',
                        left: sizeCalculator.width(-10), 
                        width: '100%', 
                        marginLeft: sizeCalculator.width(10), 
                    }}>
                    <Text style={{fontWeight: '100', 
                        textAlign: 'left', 
                        width: '100%', 
                        fontSize: sizeCalculator.fontSize(20), 
                        fontFamily: 'Montserrat-Light',
                        textAlignVertical: 'center', 
                        color: '#fff', backgroundColor: '#222', paddingTop: sizeCalculator.height(5),
                        paddingBottom: sizeCalculator.height(15),
                        paddingLeft: sizeCalculator.width(10),
                        paddingRight: sizeCalculator.width(10),
                    }}
                        >
                        {this.props.title}
                    </Text>
                    <Text style={{
                            position: 'absolute',
                            fontWeight: '100', 
                            fontFamily: 'Montserrat-Light',
                            textAlign: 'left',
                            fontSize: sizeCalculator.fontSize(13),
                            textAlignVertical: 'center', 
                            color: '#fff', backgroundColor: '#0350a4', paddingTop: sizeCalculator.height(5),
                            padding: sizeCalculator.convertSize(8),
                            top: sizeCalculator.height(-40),
                            right: sizeCalculator.width(10)
                        }}
                        >
                        Read More
                    </Text>
                </View>
            </TouchableOpacity>
		);
	}
};