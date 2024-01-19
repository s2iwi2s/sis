package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ResourcesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Resources getResourcesSample1() {
        return new Resources()
            .id(1L)
            .fileName("fileName1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static Resources getResourcesSample2() {
        return new Resources()
            .id(2L)
            .fileName("fileName2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static Resources getResourcesRandomSampleGenerator() {
        return new Resources()
            .id(longCount.incrementAndGet())
            .fileName(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
