/**
 * Author: Nikhil
 * Date: November 2019
 *
 * Purpose: Native Module to Enable Kiosk Mode.
 */
package com.kiosk;

import android.app.Activity;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class KioskModeModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "KioskMode";
    private static ReactApplicationContext reactContext;

    public KioskModeModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public  void clearDeviceOwnerApp() {
        try {
            Activity mActivity = reactContext.getCurrentActivity();
            if (mActivity != null) {
                DevicePolicyManager myDevicePolicyManager = (DevicePolicyManager) mActivity.getSystemService(Context.DEVICE_POLICY_SERVICE);
                myDevicePolicyManager.clearDeviceOwnerApp(mActivity.getPackageName());
            }
        } catch (Exception e) {
        }
    }

    @ReactMethod
    public void startLockTask() {
        try {
            Activity mActivity = reactContext.getCurrentActivity();
            if (mActivity != null) {
                DevicePolicyManager myDevicePolicyManager = (DevicePolicyManager) mActivity.getSystemService(Context.DEVICE_POLICY_SERVICE);
                ComponentName mDPM = new ComponentName(mActivity, AdminReceiver.class);

                if (myDevicePolicyManager.isDeviceOwnerApp(mActivity.getPackageName())) {
                    String[] packages = {mActivity.getPackageName()};
                    myDevicePolicyManager.setLockTaskPackages(mDPM, packages);
                    mActivity.startLockTask();
                } else {
                    mActivity.startLockTask();
                }
            }
        } catch (Exception e) {
        }
    }

    @ReactMethod
    public  void stopLockTask() {
        try {
            Activity mActivity = reactContext.getCurrentActivity();
            if (mActivity != null) {
                mActivity.stopLockTask();
            }
        } catch (Exception e) {
        }
    }
}
