package com.chup; // replace com.your-app-name with your app’s name


import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import android.app.NotificationManager;
import android.content.Intent;
import android.media.AudioManager;
import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.provider.Settings;


public class AudioHandler extends ReactContextBaseJavaModule {
    private ReactApplicationContext mContext;
    private  AudioManager mAlramMAnager;
    private NotificationManager nm;
    AudioHandler(ReactApplicationContext context) {
        super(context);
        mContext = context;
        mAlramMAnager = (AudioManager) mContext.getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
        nm = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    @Override
    public String getName() {
        return "AudioHandler";
    }

    @ReactMethod
    public void getPermission(final Promise promise){
        Boolean res = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!nm.isNotificationPolicyAccessGranted()) {
                Intent intent = new Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK |Intent.FLAG_ACTIVITY_CLEAR_TASK);
                mContext.startActivity(intent);
            }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            res = nm.isNotificationPolicyAccessGranted();
        }
        promise.resolve(res);
    }

    @ReactMethod
    public void muteDevice(String name, String location) {
            mAlramMAnager.setRingerMode(mAlramMAnager.RINGER_MODE_SILENT);
            mAlramMAnager.setStreamVolume(AudioManager.STREAM_MUSIC, 0, 0);
            mAlramMAnager.setStreamVolume(AudioManager.STREAM_ALARM, 0, 0);
    }

    @ReactMethod
    public void unMuteDevice(String name, String location) {
            mAlramMAnager.setRingerMode(mAlramMAnager.RINGER_MODE_NORMAL);
            mAlramMAnager.setStreamVolume(AudioManager.STREAM_MUSIC, 20, 0);
            mAlramMAnager.setStreamVolume(AudioManager.STREAM_ALARM, 20, 0);
    }

  

}