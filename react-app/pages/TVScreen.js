import React, {Component} from 'react';
import TVLayout from '../components/TV';
import PageLayout from '../components/MainPages';

export default class TVScreen extends Component {

  	render() {
    	return (
            <React.Fragment>
                <PageLayout
                    background={require('../components/images/background/tv-background.jpg')}
                    backScreen={() => this.props.pageRouting('MainScreen')}
                    title="Live Television"
                >
                    <TVLayout />
                </PageLayout>
            </React.Fragment>
		);
	}
};