package com.xplorereact;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.forcestop.ForceStopPackage;
import com.kiosk.KioskModePackage;
import com.manager.download.DownloadManagerPackage;

import java.util.List;


public class MainApplication extends Application implements ReactApplication {

	private static MainApplication instance = null;

  	private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
		@Override
		public boolean getUseDeveloperSupport() {
			return BuildConfig.DEBUG;
    	}

		@Override
		protected List<ReactPackage> getPackages() {
			@SuppressWarnings("UnnecessaryLocalVariable")
			List<ReactPackage> packages = new PackageList(this).getPackages();
			// Packages that cannot be autolinked yet can be added manually here, for example:
			// packages.add(new MyReactNativePackage());
			packages.add(new KioskModePackage());
			packages.add(new DownloadManagerPackage());
			packages.add(new ForceStopPackage());
			return packages;
		}


		@Override
		protected String getJSMainModuleName() {
			return "index";
		}
  	};

	@Override
	public void onCreate() {
		super.onCreate();
		SoLoader.init(this, /* native exopackage */ false);
		instance = this;
	}

	public static MainApplication getInstance() {
		return instance;
	}

	@Override
	public Context getApplicationContext() {
		return super.getApplicationContext();
	}

	@Override
  		public ReactNativeHost getReactNativeHost() {
    	return mReactNativeHost;
  	}

}
