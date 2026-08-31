package com.sis.service.mapper;

import static com.sis.domain.InvoicesAsserts.*;
import static com.sis.domain.InvoicesTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class InvoicesMapperTest {

    private InvoicesMapper invoicesMapper;

    @BeforeEach
    void setUp() {
        invoicesMapper = new InvoicesMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getInvoicesSample1();
        var actual = invoicesMapper.toEntity(invoicesMapper.toDto(expected));
        assertInvoicesAllPropertiesEquals(expected, actual);
    }
}
