package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CourseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Course getCourseSample1() {
        return new Course().id(1L).gradelevel("gradelevel1").subject("subject1").hoursPerQuarter(1L);
    }

    public static Course getCourseSample2() {
        return new Course().id(2L).gradelevel("gradelevel2").subject("subject2").hoursPerQuarter(2L);
    }

    public static Course getCourseRandomSampleGenerator() {
        return new Course()
            .id(longCount.incrementAndGet())
            .gradelevel(UUID.randomUUID().toString())
            .subject(UUID.randomUUID().toString())
            .hoursPerQuarter(longCount.incrementAndGet());
    }
}
