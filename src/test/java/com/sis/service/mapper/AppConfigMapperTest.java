package com.sis.service.mapper;

import static com.sis.domain.AppConfigAsserts.*;
import static com.sis.domain.AppConfigTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AppConfigMapperTest {

    private AppConfigMapper appConfigMapper;

    @BeforeEach
    void setUp() {
        appConfigMapper = new AppConfigMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAppConfigSample1();
        var actual = appConfigMapper.toEntity(appConfigMapper.toDto(expected));
        assertAppConfigAllPropertiesEquals(expected, actual);
    }
}
