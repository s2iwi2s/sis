package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AppConfigTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static AppConfig getAppConfigSample1() {
        return new AppConfig().id(1L).code("code1").value("value1").description("description1").priority(1);
    }

    public static AppConfig getAppConfigSample2() {
        return new AppConfig().id(2L).code("code2").value("value2").description("description2").priority(2);
    }

    public static AppConfig getAppConfigRandomSampleGenerator() {
        return new AppConfig()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .value(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .priority(intCount.incrementAndGet());
    }
}
