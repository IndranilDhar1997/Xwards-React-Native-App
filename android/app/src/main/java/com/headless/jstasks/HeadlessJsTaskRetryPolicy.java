package com.headless.jstasks;

import javax.annotation.CheckReturnValue;

public interface HeadlessJsTaskRetryPolicy {

    boolean canRetry();

    int getDelay();

    @CheckReturnValue
    HeadlessJsTaskRetryPolicy update();

    HeadlessJsTaskRetryPolicy copy();
}