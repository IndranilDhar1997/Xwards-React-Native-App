# React Application

### Dependencies

1. NPM
2. React Native
	
	> npm install -g react-native-cli

3. JDK 8
4. Android SDK


## Creating New Application

	> react-native init <ProjectName>
	> cd <ProjectName>
	> react-native bundle --platform android --dev true --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
	> react-native start //Start dev server
	> react-native run-android //To create a new debug app and run on the device.
	> cd android
	> gradlew app:dependencies

