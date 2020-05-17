import React, {Component} from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native';
import NewsTile from './contentTile';
import NewsList from './contentList';
import NewsService from '../../service/NewsService';
import sizeCalculator from '../../utility/tile-layouts/sizeCalculator';

export default class NewsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            headlines: NewsService.getHeadlines(),
            otherNews: NewsService.getOtherNews()
        }
    }

    componentDidMount() {
        NewsService.deleteExpiredContents().then(() => {
            NewsService.getNews();
        });
    }

  	render() {
    	return (
            <React.Fragment>
                {(!this.state) && 
                    <View style={{position: 'absolute', top: sizeCalculator.height(330), left: sizeCalculator.width(560)}}>
                        <Bubbles size={sizeCalculator.convertSize(30)} color="#FFF" spaceBetween={sizeCalculator.width(10)} />
                    </View>
                }
                {this.state && 
                    <React.Fragment>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width: '100%', marginBottom: sizeCalculator.height(10), marginTop:sizeCalculator.height(10), height: sizeCalculator.height(310), position: 'relative'}}>
                            {this.state.headlines.map(news => {
                                return (
                                    <NewsTile key={news.id} imgSrc={news.coverImg} title={news.contentTitle} partnerLogo={news.partnerLogo} onClick={(e) => this.props.route(e, news)} />
                                )
                            })}
                        </ScrollView>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{width: '70%'}}>
                                {Object.keys(this.state.otherNews).map(topic => {
                                    return(
                                        <React.Fragment key={topic}>
                                            <Text style={{fontSize: sizeCalculator.fontSize(25), fontFamily: 'Montserrat-Regular', textAlignVertical: 'center', color: '#fff', marginLeft: sizeCalculator.width(20), marginBottom: sizeCalculator.height(30)}}>
                                                {topic}
                                            </Text>
                                            {this.state.otherNews[topic].map(topicNews => {
                                                return (<NewsList key={topicNews.id} category={topicNews.category} imgSrc={topicNews.coverImg} title={topicNews.contentTitle} partnerLogo={topicNews.partnerLogo} onClick={(e) => this.props.route(e, topicNews)} />)
                                            })}
                                        </React.Fragment>
                                    )
                                })}
                            </View>
                            <View style={{width: '30%'}}>
                            </View>
                        </View>
                    </React.Fragment>
                }
            </React.Fragment>
		);
	}
};