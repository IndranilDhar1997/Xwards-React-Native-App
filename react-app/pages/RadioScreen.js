import React, {Component} from 'react';
import Radio from '../components/Radio';
import PageLayout from '../components/MainPages';

export default class RadioScreen extends Component {

  	render() {
    	return (
            <React.Fragment>
                <PageLayout
                    background={require('../components/images/background/radio-background.jpg')}
                    backScreen={() => this.props.pageRouting('MainScreen')}
                    title="Radio Stations"
                >
                    <Radio />
                </PageLayout>
            </React.Fragment>
		);
	}
};