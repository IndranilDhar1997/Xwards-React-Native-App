import LoggerService from './LoggingService';
import NewsService from './NewsService';

const InternetService = {
    connected: false,

    isConnected() {
        return this.connected;
    },
    updateConnection(connection) {
        this.connected = connection;
        if (this.isConnected()) {
            //Send the logs from table to server
            LoggerService.sendOfflineLogs();
            NewsService.fetchNews();
        }
    }
};

export default InternetService;