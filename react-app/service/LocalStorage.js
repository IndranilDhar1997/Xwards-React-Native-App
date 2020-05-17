import AsyncStorage from '@react-native-community/async-storage';

export default LocalStorage = {
    get(key, callback) {
        try {
            AsyncStorage.getItem(key).then(value => {
                if (!value) {
                    callback(null);
                    return false;
                }
                console.log('Get Storage Data', value);
                callback(JSON.parse(value));
            }).catch(e => {
                console.error(e);
            })
        } catch (error) {
            console.error(error);
        }
    },
    set(key, value, callback) {
        callback = callback || null;
        if (typeof value !== 'object') {
            console.error('Non-Object Passed');
            return false;
        }
        value = JSON.stringify(value);
        try {
            AsyncStorage.setItem(key, value).then((e) => {
                if (e) {
                    console.error('Error!', e);
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }).catch(e => {
                console.error(e);
            });
        } catch (error) {
            console.error(error);
            // Error saving data
        }
    },
    delete(key, callback) {
        callback = callback || null;
        try {
            AsyncStorage.removeItem(key).then((e) => {
                if (e) {
                    console.error('Error!', e);
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }).catch(e => {
                console.error(e);
            });
        } catch (error) {
            console.error(error);
            // Error saving data
        }
    }
};