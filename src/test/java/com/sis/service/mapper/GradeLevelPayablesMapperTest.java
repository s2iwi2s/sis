package com.sis.service.mapper;

import static com.sis.domain.GradeLevelPayablesAsserts.*;
import static com.sis.domain.GradeLevelPayablesTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GradeLevelPayablesMapperTest {

    private GradeLevelPayablesMapper gradeLevelPayablesMapper;

    @BeforeEach
    void setUp() {
        gradeLevelPayablesMapper = new GradeLevelPayablesMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getGradeLevelPayablesSample1();
        var actual = gradeLevelPayablesMapper.toEntity(gradeLevelPayablesMapper.toDto(expected));
        assertGradeLevelPayablesAllPropertiesEquals(expected, actual);
    }
}
