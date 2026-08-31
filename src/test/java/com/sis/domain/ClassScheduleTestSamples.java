package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ClassScheduleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static ClassSchedule getClassScheduleSample1() {
        return new ClassSchedule().id(1L).name("name1");
    }

    public static ClassSchedule getClassScheduleSample2() {
        return new ClassSchedule().id(2L).name("name2");
    }

    public static ClassSchedule getClassScheduleRandomSampleGenerator() {
        return new ClassSchedule().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString());
    }
}
