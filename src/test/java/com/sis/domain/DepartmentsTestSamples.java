package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DepartmentsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Departments getDepartmentsSample1() {
        return new Departments().id(1L).name("name1").description("description1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Departments getDepartmentsSample2() {
        return new Departments().id(2L).name("name2").description("description2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Departments getDepartmentsRandomSampleGenerator() {
        return new Departments()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
