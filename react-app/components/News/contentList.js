import React, {Component} from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class NewsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logoHeight: sizeCalculator.height(24),
            logoWidth: sizeCalculator.width(100)
        }
    }

    componentDidMount() {
        Image.getSize(this.props.partnerLogo, function (srcWidth, srcHeight) {
            srcWidth = sizeCalculator.width(parseFloat((this.state.logoHeight*srcWidth)/srcHeight));
            this.setState({logoWidth: srcWidth});
        }.bind(this));
    }

  	render() {
    	return (
            <React.Fragment>
                <TouchableOpacity onPress={this.props.onClick} style={{flex: 1, flexDirection: 'row', paddingLeft: sizeCalculator.width(20), marginBottom: sizeCalculator.height(20)}}>
                    <View style={{width: '30%', height: sizeCalculator.height(150), position: 'relative'}}>
                        <Image
                            style={{width: '100%', height: '100%'}}
                            source={{uri: this.props.imgSrc}}
                        />
                        <View style={{backgroundColor: 'white', position: 'absolute', top: sizeCalculator.height(5), left: sizeCalculator.width(5), padding: sizeCalculator.convertSize(5)}}>
                            <Image
                                style={{ height: this.state.logoHeight, width: this.state.logoWidth, alignContent: 'flex-start' }}
                                source={{uri: this.props.partnerLogo}}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                    <View style={{width: '60%'}}>
                        <Text style={{fontWeight: '100', 
                            fontSize: sizeCalculator.fontSize(20),
                            fontFamily: 'Montserrat-Light',
                            textAlignVertical: 'center', 
                            color: '#fff',
                            paddingBottom: sizeCalculator.height(15),
                            paddingLeft: sizeCalculator.width(10),
                            paddingRight: sizeCalculator.width(10),
                            letterSpacing: sizeCalculator.convertSize(1.3)
                        }}
                            >
                            {this.props.title}
                        </Text>
                        <View style={{
                            marginLeft: sizeCalculator.width(10),
                            position: 'relative'}}>
                            <Text style={{
                                    fontWeight: '100', 
                                    fontFamily: 'Montserrat-Light',
                                    textAlign: 'left',
                                    position: 'absolute',
                                    fontSize: sizeCalculator.fontSize(13),
                                    textAlignVertical: 'center', 
                                    color: '#fff', backgroundColor: '#0350a4', paddingTop: sizeCalculator.height(5),
                                    padding: sizeCalculator.convertSize(8)
                                }}
                                >
                                Read More
                            </Text>
                        </View>
                        <View style={{
                            marginLeft: sizeCalculator.width(10),
                            position: 'relative', marginLeft: sizeCalculator.width(120)}}>
                            <Text style={{
                                    fontWeight: '100',
                                    fontFamily: 'Montserrat-Light',
                                    textAlign: 'left',
                                    position: 'absolute',
                                    fontSize: sizeCalculator.fontSize(13),
                                    textAlignVertical: 'center', 
                                    color: '#fff', backgroundColor: '#222', paddingTop: 5,
                                    padding: sizeCalculator.convertSize(8)
                                }}
                                >
                                {this.props.category}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </React.Fragment>
		);
	}
};