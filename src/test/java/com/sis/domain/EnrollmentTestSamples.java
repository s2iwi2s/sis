package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EnrollmentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Enrollment getEnrollmentSample1() {
        return new Enrollment().id(1L).createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Enrollment getEnrollmentSample2() {
        return new Enrollment().id(2L).createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Enrollment getEnrollmentRandomSampleGenerator() {
        return new Enrollment()
            .id(longCount.incrementAndGet())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
