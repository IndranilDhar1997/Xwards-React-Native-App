import {Component} from 'react';
import LoggingService from '../service/LoggingService';

export default class Clickable extends Component {
    logAction(object) {
        if(object.page !== "WebAds") {
            object = object || {};
            LoggingService.log(object);
        } else {
            LoggingService.log({
                type: 'WEBADS',
                action: 'WEB-ADS',
                data: object
            })
        }
    }
}