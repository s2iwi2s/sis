package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class OrgTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Org getOrgSample1() {
        return new Org().id(1L).name("name1").logo("logo1").address("address1");
    }

    public static Org getOrgSample2() {
        return new Org().id(2L).name("name2").logo("logo2").address("address2");
    }

    public static Org getOrgRandomSampleGenerator() {
        return new Org()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .logo(UUID.randomUUID().toString())
            .address(UUID.randomUUID().toString());
    }
}
