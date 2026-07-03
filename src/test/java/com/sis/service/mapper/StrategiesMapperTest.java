package com.sis.service.mapper;

import static com.sis.domain.StrategiesAsserts.*;
import static com.sis.domain.StrategiesTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class StrategiesMapperTest {

    private StrategiesMapper strategiesMapper;

    @BeforeEach
    void setUp() {
        strategiesMapper = new StrategiesMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getStrategiesSample1();
        var actual = strategiesMapper.toEntity(strategiesMapper.toDto(expected));
        assertStrategiesAllPropertiesEquals(expected, actual);
    }
}
