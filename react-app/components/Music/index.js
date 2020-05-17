import React, {Component} from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native';

import playlistSample from './playlists';

export default class NewsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playlists: playlistSample
        }
    }

  	render() {
    	return (
            <React.Fragment>
            </React.Fragment>
		);
	}
};