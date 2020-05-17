/**
 * Author: Nikhil
 * Date: January 2020
 *
 * Purpose: Native Module to Force stop app.
 */
package com.forcestop;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class ForceStopModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "ForceStop";
    private static ReactApplicationContext reactContext;

    public ForceStopModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void restart () {
        try {
            android.os.Process.killProcess(android.os.Process.myPid());
        }
        catch (Exception e) {
        }
    }

}
