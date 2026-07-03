package com.sis.service.mapper;

import static com.sis.domain.ResourcesAsserts.*;
import static com.sis.domain.ResourcesTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ResourcesMapperTest {

    private ResourcesMapper resourcesMapper;

    @BeforeEach
    void setUp() {
        resourcesMapper = new ResourcesMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getResourcesSample1();
        var actual = resourcesMapper.toEntity(resourcesMapper.toDto(expected));
        assertResourcesAllPropertiesEquals(expected, actual);
    }
}
