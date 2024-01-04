package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class StrategiesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Strategies getStrategiesSample1() {
        return new Strategies().id(1L).name("name1").description("description1");
    }

    public static Strategies getStrategiesSample2() {
        return new Strategies().id(2L).name("name2").description("description2");
    }

    public static Strategies getStrategiesRandomSampleGenerator() {
        return new Strategies()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString());
    }
}
