package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PaymentsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Payments getPaymentsSample1() {
        return new Payments()
            .id(1L)
            .transactionReference("transactionReference1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static Payments getPaymentsSample2() {
        return new Payments()
            .id(2L)
            .transactionReference("transactionReference2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static Payments getPaymentsRandomSampleGenerator() {
        return new Payments()
            .id(longCount.incrementAndGet())
            .transactionReference(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
