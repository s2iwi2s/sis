package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AssessmentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Assessment getAssessmentSample1() {
        return new Assessment().id(1L).name("name1").instruction("instruction1");
    }

    public static Assessment getAssessmentSample2() {
        return new Assessment().id(2L).name("name2").instruction("instruction2");
    }

    public static Assessment getAssessmentRandomSampleGenerator() {
        return new Assessment()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .instruction(UUID.randomUUID().toString());
    }
}
