import React, {Component} from 'react';
import PageLayout from '../components/MainPages';
import News from '../components/News/index';

export default class NewsScreen extends Component {

    constructor(props) {
        super(props);
    }

    toNewsPage(e, news) {
        this.props.pageRouting("ReadingSection", news);
    }

  	render() {
    	return (
            <React.Fragment>
                <PageLayout
                    background={require('../components/images/background/news-background.jpg')}
                    backScreen={() => this.props.pageRouting('MainScreen')}
                    title="News Headlines and The World"
                >
                    <News route={(e, news) => this.toNewsPage(e, news)} />
                </PageLayout>
            </React.Fragment>
		);
	}
};