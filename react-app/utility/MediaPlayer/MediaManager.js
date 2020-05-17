import {
    MediaPlayer, 
    MediaPlayer__Play, 
    MediaPlayer__GetMediaInfo, 
    MediaPlayer__GetVolume, 
    MediaPlayer__SetVolume, 
    MediaPlayer__RegisterOnStop,
    MediaPlayer__RegisterOnNextMedia,
    MediaPlayer__RegisterOnPreviousMedia,
    MediaPlayer__Stop
} from './XMediaPlayer';
export default {
    buildtrack(type, data) {
        if (data === null) {
            return null;
        }
        switch (type) {
            case 'Radio':
                return {
                    id: data.id,
                    url: data.url,
                    album: data.name,
                    image: data.thumbnail,
                    type: 'Radio'
                }
                break;
            case 'TV':
                return {
                    id: data.id,
                    url: data.url,
                    album: data.name,
                    type: 'TV',
                    player: data.player
                }
                break;
            case 'XPlay':
                return {
                    id: data.id,
                    neo_id: data.neo_id,
                    url: data.content_url,
                    album: data.title,
                    type: 'Video',
                    player: data.player,
                    keywords: data.keywords
                }
                break;
            case 'Video':
                return {
                    id: data.id,
                    neo_id: data.videoId,
                    url: data.video_url,
                    album: data.title,
                    type: 'Video',
                    player: 'native',
                    keywords: data.keywords
                }
                break;
        }
    },

    stopMedia(mediaType) {
        MediaPlayer__Stop(mediaType)
    },

    playRadio(media, callback) {
        MediaPlayer__Play(media, callback);
    },

    playTV(media, callback) {
        MediaPlayer__Play(media, callback);
    },

    playVideo(media, callback) {
        MediaPlayer__Play(media, callback);
    },

    getMedia() {
        return MediaPlayer__GetMediaInfo();
    },

    setVolume(volume) {
        MediaPlayer__SetVolume(volume);
    },

    getVolume() {
        return MediaPlayer__GetVolume();
    },

    onStopMedia(func) {
        MediaPlayer__RegisterOnStop(func);
    },

    onNextMedia(func) {
        MediaPlayer__RegisterOnNextMedia(func);
    },

    onPreviousTrack(func) {
        MediaPlayer__RegisterOnPreviousMedia(func);
    }
}