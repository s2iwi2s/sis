package com.sis.service.mapper;

import static com.sis.domain.PaymentsAsserts.*;
import static com.sis.domain.PaymentsTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PaymentsMapperTest {

    private PaymentsMapper paymentsMapper;

    @BeforeEach
    void setUp() {
        paymentsMapper = new PaymentsMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getPaymentsSample1();
        var actual = paymentsMapper.toEntity(paymentsMapper.toDto(expected));
        assertPaymentsAllPropertiesEquals(expected, actual);
    }
}
