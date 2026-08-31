package com.sis.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class GradeLevelPayablesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static GradeLevelPayables getGradeLevelPayablesSample1() {
        return new GradeLevelPayables().id(1L);
    }

    public static GradeLevelPayables getGradeLevelPayablesSample2() {
        return new GradeLevelPayables().id(2L);
    }

    public static GradeLevelPayables getGradeLevelPayablesRandomSampleGenerator() {
        return new GradeLevelPayables().id(longCount.incrementAndGet());
    }
}
