import React, {Component} from 'react';
import PageLayout from '../components/MainPages';
import VideoPage from '../components/Video/index';

export default class VideoScreen extends Component {

  	render() {
    	return (
            <React.Fragment>
                <PageLayout
                    background={require('../components/images/background/video-background.jpg')}
                    backScreen={() => this.props.pageRouting('MainScreen')}
                    title="Entertainment and Videos"
                    noScroll={true}
                >
                    <VideoPage channelId={this.props.channelId} />
                </PageLayout>
            </React.Fragment>
		);
	}
};