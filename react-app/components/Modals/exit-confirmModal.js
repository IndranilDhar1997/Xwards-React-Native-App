import React, {Component} from 'react';
import {ToastAndroid } from 'react-native';
import DialogInput from 'react-native-dialog-input';
import KioskMode from '../../native-module/KioskMode';

export default class ExitModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false
        }
    }

    showDialog() {
        this.setState({showDialog: true});
        setTimeout(() => this.hideDialog(), 60000);
	}
	
	hideDialog() {
        this.setState({showDialog: false});
    }

    sendInput(input) {
        if (input == 'XwardsDevelopmentTeam@BLR') {
            KioskMode.stopLockTask();
            this.hideDialog();
        }
        else {
            this.hideDialog();
            ToastAndroid.show('Invalid PIN.', ToastAndroid.SHORT);
        }
    }

    render (){
        return(
            <DialogInput isDialogVisible={this.state.showDialog}
                title={"Exit Kiosk Mode"}
                message={"Please enter PIN to exit Kiosk mode."}
                submitInput={ (inputText) => {this.sendInput(inputText)} }
                closeDialog={ () => {this.hideDialog()}}>
            </DialogInput>
        )
    }
}