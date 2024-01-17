package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LearningCompetencyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static LearningCompetency getLearningCompetencySample1() {
        return new LearningCompetency()
            .id(1L)
            .seqNo(1)
            .competencyCode("competencyCode1")
            .description("description1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static LearningCompetency getLearningCompetencySample2() {
        return new LearningCompetency()
            .id(2L)
            .seqNo(2)
            .competencyCode("competencyCode2")
            .description("description2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static LearningCompetency getLearningCompetencyRandomSampleGenerator() {
        return new LearningCompetency()
            .id(longCount.incrementAndGet())
            .seqNo(intCount.incrementAndGet())
            .competencyCode(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
