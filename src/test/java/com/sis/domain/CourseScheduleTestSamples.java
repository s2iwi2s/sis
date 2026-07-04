package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CourseScheduleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static CourseSchedule getCourseScheduleSample1() {
        return new CourseSchedule()
            .id(1L)
            .room("room1")
            .weekDay(1)
            .description("description1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static CourseSchedule getCourseScheduleSample2() {
        return new CourseSchedule()
            .id(2L)
            .room("room2")
            .weekDay(2)
            .description("description2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static CourseSchedule getCourseScheduleRandomSampleGenerator() {
        return new CourseSchedule()
            .id(longCount.incrementAndGet())
            .room(UUID.randomUUID().toString())
            .weekDay(intCount.incrementAndGet())
            .description(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
