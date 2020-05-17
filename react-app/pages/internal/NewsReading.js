import React, {Component} from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native';
import PageLayout from '../../components/MainPages';
import { WebView } from 'react-native-webview';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class ReadingScreen extends Component {

    constructor(props) {
        super(props);
    }

  	render() {
    	return (
            <React.Fragment>
                <PageLayout
                    background={require('../../components/images/background/news-background-2.jpg')}
                    backScreen={() => this.props.pageRouting('News')}
                    title={this.props.data.contentTitle}
                    theme="light"
                >
                    <View style={{flex: 1, flexDirection:'row'}}>
                        <ScrollView style={{width: '65%'}}>
                            <WebView
                                hideKeyboardAccessoryView={true}
                                scalesPageToFit={false}
                                source={{html: "<meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0'><style>p{font-size: 24px !important;}</style><div style='width: 100%; height: 380px; background: url("+this.props.data.coverImg+") no-repeat center center; background-size: cover;' ></div>"+this.props.data.contentHtml}} 
                                style={{width: '100%', height: sizeCalculator.height(590), backgroundColor: 'rgba(52, 52, 52, 0)'}} 
                                injectJavaScript={false}
                                automaticallyAdjustContentInsets={false}
                                javaScriptEnabled={false}
                            />
                        </ScrollView>
                        <View style={{width: '35%'}}>

                        </View>
                    </View>
                </PageLayout>
            </React.Fragment>
		);
	}
};