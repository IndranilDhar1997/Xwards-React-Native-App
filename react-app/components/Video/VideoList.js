import React, {Component} from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native';

export default class VideoList extends Component {

  	render() {
    	return (
            <React.Fragment>
                <TouchableOpacity onPress={this.props.onClick} style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                    <View style={{width: '33%', height: 120, position: 'relative'}}>
                        <Image
                            style={{width: '100%', height: '100%'}}
                            source={{uri: this.props.thumbnail}}
                        />
                    </View>
                    <View style={{width: '60%'}}>
                        <Text style={{fontWeight: '100', 
                            fontSize: 18,
                            fontFamily: 'Montserrat-Light',
                            textAlignVertical: 'center', 
                            color: '#fff',
                            paddingBottom: 15,
                            paddingLeft: 10,
                            paddingRight: 10,
                            maxHeight: 80,
                            overflow: 'hidden'
                        }}
                            >
                            {this.props.title}
                        </Text>
                        <View style={{marginLeft: 10, position: 'relative'}}>
                            <Text style={{
                                fontWeight: '100', 
                                fontFamily: 'Montserrat-Light',
                                textAlign: 'left',
                                position: 'absolute',
                                fontSize: 13,
                                textAlignVertical: 'center', 
                                color: '#fff', backgroundColor: '#0350a4', paddingTop: 5,
                                padding: 8,
                                flexWrap: 'wrap'
                            }}>
                                Watch Now
                            </Text>
                        </View>
                        {/* <View style={{position: 'relative', marginLeft: 130}}>
                            <Text style={{
                                    fontWeight: '100',
                                    fontFamily: 'Montserrat-Light',
                                    textAlign: 'left',
                                    position: 'absolute',
                                    fontSize: 13,
                                    textAlignVertical: 'center', 
                                    color: '#fff', backgroundColor: '#222', paddingTop: 5,
                                    padding: 8
                                }}
                                >
                                TVF
                            </Text>
                        </View> */}
                    </View>
                </TouchableOpacity>
            </React.Fragment>
		);
	}
};