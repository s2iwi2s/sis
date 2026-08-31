package com.sis.service.mapper;

import static com.sis.domain.AccountPayablesAsserts.*;
import static com.sis.domain.AccountPayablesTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AccountPayablesMapperTest {

    private AccountPayablesMapper accountPayablesMapper;

    @BeforeEach
    void setUp() {
        accountPayablesMapper = new AccountPayablesMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAccountPayablesSample1();
        var actual = accountPayablesMapper.toEntity(accountPayablesMapper.toDto(expected));
        assertAccountPayablesAllPropertiesEquals(expected, actual);
    }
}
