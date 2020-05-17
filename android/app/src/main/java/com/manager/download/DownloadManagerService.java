package com.manager.download;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;


import com.facebook.react.HeadlessJsTaskService;
public class DownloadManagerService extends Service {
    private Handler handler = new Handler();
    private Runnable runnableCode = () -> {
        Context context = getApplicationContext();
        Intent myIntent = new Intent(context, DownloadManagerEventService.class);
        context.startService(myIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    };


    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        this.handler.post(this.runnableCode);
        return START_STICKY;
    }
}
