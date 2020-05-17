import DataSyncService from './react-app/service/DataSyncService';
import LocalStorage from './react-app/service/LocalStorage';
import config from './react-app/utility/config';

export default DownloadManagerHeadless = async () => {
	let currentTime = new Date();
	currentTime = parseInt(currentTime.getTime()/1000);
	LocalStorage.get('DownloadSyncTime', function(val) {
		if (val) {
			if ((currentTime-parseInt(val.syncTime)) > config.downloadSyncTime*60*60) {
				LocalStorage.set('DownloadSyncTime', {syncTime: currentTime+''}, function() {
					DataSyncService.startDownload();
				});
			}
		} else {
			LocalStorage.set('DownloadSyncTime', {syncTime: currentTime+''}, function() {
				DataSyncService.startDownload();
			});
		}
	});
}
