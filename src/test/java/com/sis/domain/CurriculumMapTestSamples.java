package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CurriculumMapTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static CurriculumMap getCurriculumMapSample1() {
        return new CurriculumMap()
            .id(1L)
            .quarterNo(1)
            .weekNo(1)
            .topic("topic1")
            .contentStandards("contentStandards1")
            .performanceStandards("performanceStandards1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static CurriculumMap getCurriculumMapSample2() {
        return new CurriculumMap()
            .id(2L)
            .quarterNo(2)
            .weekNo(2)
            .topic("topic2")
            .contentStandards("contentStandards2")
            .performanceStandards("performanceStandards2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static CurriculumMap getCurriculumMapRandomSampleGenerator() {
        return new CurriculumMap()
            .id(longCount.incrementAndGet())
            .quarterNo(intCount.incrementAndGet())
            .weekNo(intCount.incrementAndGet())
            .topic(UUID.randomUUID().toString())
            .contentStandards(UUID.randomUUID().toString())
            .performanceStandards(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
