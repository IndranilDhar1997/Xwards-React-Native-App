import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import Localstorage from './LocalStorage';
import config from '../utility/config';
import Database from './DatabaseService';
import axios from 'axios';

const granted = PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

const LoggingService = {
    deviceId: null,
    serverDeviceId: null,
    position: {lat: 0, lng: 0},
    init() {
        Localstorage.get('ServerDeviceId', function(data) {
            if (data) {
                this.serverDeviceId = parseInt(data.deviceId);
            }
        }.bind(this));
    },
    watchPosition() {
        if (granted) {
            console.log('LOCATION ACCESS ALLOWED');
            Geolocation.watchPosition(function(position) {
                LoggingService.position = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            }, function(error) {
            }, {
                enableHighAccuracy: true,
                distanceFilter: 200,
                showLocationDialog: true,
                forceRequestLocation: true
            })
        } else {
            console.log('LOCATION ACCESS DENIED');
        }
    },
    getDeviceId() {
        return this.serverDeviceId;
    },
    setServerDeviceID (deviceId) {
        this.serverDeviceId = deviceId+'';
        Localstorage.set('ServerDeviceId', {deviceId: this.serverDeviceId});
    },
    setDeviceId(deviceId) {
        this.deviceId = deviceId;
        Localstorage.set('DeviceId', {deviceId: this.deviceId});
    },
    log(object) {
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let currentTime = new Date();
        currentTime = `[${((''+currentTime.getDate()).length < 2) ? '0'+currentTime.getDate() : currentTime.getDate()}/${monthNames[currentTime.getMonth()]}/${currentTime.getFullYear()}:${((''+currentTime.getHours()).length < 2) ? '0'+currentTime.getHours() : currentTime.getHours()}:${((''+currentTime.getMinutes()).length < 2) ? '0'+currentTime.getMinutes() : currentTime.getMinutes()}:${((''+currentTime.getSeconds()).length < 2) ? '0'+currentTime.getSeconds() : currentTime.getSeconds()} ${currentTime.toString().split("GMT")[1].split(" (")[0]}]`;
        
        let log = `${object.type.toUpperCase()} ${this.serverDeviceId} ${this.deviceId} ${config.appVersion} IN ${currentTime} (${this.position.lat},${this.position.lng})`;

        switch (object.type) {
            case "Navigation":
                log += ` ${object.page.toUpperCase()}`;
                log = 'PAGE '+log;
                break;
            case "TV":
                log += ` ${object.action.toUpperCase()} [${object.data.album}]`;
                break;
            case "Video":
                log += ` ${object.action.toUpperCase()}`;
                if (object.data) {
                    log += ` ${object.data.neo_id} [${object.data.keywords}]`;
                }
                break;
            case "Radio":
                log += ` ${object.action.toUpperCase()}`;
                if ('data' in object && object.data !== null) {
                    log += ('album' in object.data) ? ` [${object.data.album.toUpperCase()}]` : (('name' in object.data) ? ` [${object.data.name.toUpperCase()}]`: '');
                }
                break;
            case "Tile":
                if ('data' in object && object.data) {
                    switch (object.data.type.toUpperCase()) {
                        case "NEWS":
                            log += ` ${object.action.toUpperCase()} ${object.data.tileSize.toUpperCase()} ${object.data.type.toUpperCase()} [${object.data.partner}] [${object.data.category}] ${object.data.contentUrl}`;
                            break;
                        case "XPLAY":
                            log += ` ${object.action.toUpperCase()} ${object.data.tileSize.toUpperCase()} ${object.data.type.toUpperCase()} ${object.data.neo_id} [${object.data.keywords}]`;
                            break;
                        case "TV":
                            log += ` ${object.action.toUpperCase()} ${object.data.tileSize.toUpperCase()} ${object.data.type.toUpperCase()} [${object.data.name}]`;
                            break;
                        case "RADIO":
                            log += ` ${object.action.toUpperCase()} ${object.data.tileSize.toUpperCase()} ${object.data.type.toUpperCase()} [${object.data.name}]`;
                            break;
                        case "WEB-ADS":
                            log += ` [${object.data.brand}]`;
                            break;
                    }
                }
                break;
            case "VIDEOADS": 
                log += ` ${object.action.toUpperCase()} ${object.data.fileName} ${object.data.id}`
                break;
            case "WEBADS":
                var string = object.data.data.brand;
                var brandName = string.replace(/ +?/g, '');
                log += ` ${object.action.toUpperCase()} ${brandName} ${object.data.data.url}`
                break;    
            case "Info":
            case "Settings":
                log += ` ${object.action.toUpperCase()}`;
                if ('data' in object) {
                    log += ` ${object.data}`;
                }
                break;
        }

        let loggingURL = config.routes.LOGSERVER();
        axios({
            method: "post",
            url: loggingURL,
            timeout: 10000, 
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                logs: [log]
            }
        }).then(function(response) {
            
        }).catch(e => {
            console.log('Unable to reach the server for logging', e);
            let query = `INSERT INTO logs (log, markDeleted) VALUES('${log}', 0)`;
            Database.run(query).then(() => {
                // console.log('Log Saved in Database');
            });
        });
    },
    sendOfflineLogs() {
        Database.run(`SELECT * FROM logs`).then(results => {
            if (!(results.rows.length > 0)) {
                return false;
            }
            let logCount = results.rows.length;
            for (i=0; i<logCount; i+=100) {
                let query = `SELECT id, log FROM logs LIMIT 100 OFFSET ${i}`;
                Database.run(query).then(logResults => {
                    let logToSend = [];
                    let logIDSent = [];
                    for (let a=0 ; a<logResults.rows.length ; a++) {
                        logToSend.push(logResults.rows.item(a).log);
                        logIDSent.push(logResults.rows.item(a).id);
                    }
                    logIDSent = logIDSent.join(',');
                    let offlineLogUrl = config.routes.LOGSERVER();
                    axios({
                        method: "post",
                        url: offlineLogUrl,
                        timeout: 10000, 
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: {
                            logs: logToSend
                        }
                    }).then(function(response) {
                        let deleteQuery = `DELETE FROM logs WHERE id IN (${logIDSent})`;
                        Database.run(deleteQuery).then(() => {

                        });
                    }).catch(e => {
                        console.log('log Not sent', e);
                    });
                });
            }
        });
    }
};

export default LoggingService;