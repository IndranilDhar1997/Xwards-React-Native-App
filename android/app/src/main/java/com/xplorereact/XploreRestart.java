/**
 * Author: Nikhil
 * Date: November 2019
 *
 * Purpose: Restart the App on Crash.
 */
package com.xplorereact;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;


public class XploreRestart implements Thread.UncaughtExceptionHandler {

    private Activity activity;
    public XploreRestart(Activity a) {
        activity = a;
    }
    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
        Intent intent = new Intent(activity, MainActivity.class);
        intent.putExtra("crash", true);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_CLEAR_TASK
                | Intent.FLAG_ACTIVITY_NEW_TASK);    PendingIntent pendingIntent = PendingIntent.getActivity(MainApplication.getInstance().getBaseContext(), 0, intent, PendingIntent.FLAG_ONE_SHOT);    AlarmManager mgr = (AlarmManager) MainApplication.getInstance().getBaseContext().getSystemService(Context.ALARM_SERVICE);
        mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 100, pendingIntent);    activity.finish();
        System.exit(2);
        }
    }