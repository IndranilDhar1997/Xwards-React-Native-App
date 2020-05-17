import React, {Component} from 'react';
import PageLayout from '../components/MainPages';
import Music from '../components/Music/index';

export default class MusicScreen extends Component {

  	render() {
    	return (
            <React.Fragment>
                <PageLayout
                    background={require('../components/images/background/music-background.jpg')}
                    backScreen={() => this.props.pageRouting('MainScreen')}
                    title="Songs &amp; Music"
                >
                    <Music />
                </PageLayout>
            </React.Fragment>
		);
	}
};