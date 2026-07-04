package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AcademicTermsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static AcademicTerms getAcademicTermsSample1() {
        return new AcademicTerms().id(1L).name("name1").code("code1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static AcademicTerms getAcademicTermsSample2() {
        return new AcademicTerms().id(2L).name("name2").code("code2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static AcademicTerms getAcademicTermsRandomSampleGenerator() {
        return new AcademicTerms()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
