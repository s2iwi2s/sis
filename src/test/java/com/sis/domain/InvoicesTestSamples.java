package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class InvoicesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Invoices getInvoicesSample1() {
        return new Invoices().id(1L).status("status1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Invoices getInvoicesSample2() {
        return new Invoices().id(2L).status("status2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Invoices getInvoicesRandomSampleGenerator() {
        return new Invoices()
            .id(longCount.incrementAndGet())
            .status(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
