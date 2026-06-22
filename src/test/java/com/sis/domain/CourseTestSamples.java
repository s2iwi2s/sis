package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CourseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Course getCourseSample1() {
        return new Course().id(1L).subject("subject1").hoursPerQuarter(1L).createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Course getCourseSample2() {
        return new Course().id(2L).subject("subject2").hoursPerQuarter(2L).createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Course getCourseRandomSampleGenerator() {
        return new Course()
            .id(longCount.incrementAndGet())
            .subject(UUID.randomUUID().toString())
            .hoursPerQuarter(longCount.incrementAndGet())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
