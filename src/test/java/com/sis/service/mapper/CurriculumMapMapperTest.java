package com.sis.service.mapper;

import static com.sis.domain.CurriculumMapAsserts.*;
import static com.sis.domain.CurriculumMapTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CurriculumMapMapperTest {

    private CurriculumMapMapper curriculumMapMapper;

    @BeforeEach
    void setUp() {
        curriculumMapMapper = new CurriculumMapMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCurriculumMapSample1();
        var actual = curriculumMapMapper.toEntity(curriculumMapMapper.toDto(expected));
        assertCurriculumMapAllPropertiesEquals(expected, actual);
    }
}
