package com.sis.service.mapper;

import static com.sis.domain.AcademicYearAsserts.*;
import static com.sis.domain.AcademicYearTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AcademicYearMapperTest {

    private AcademicYearMapper academicYearMapper;

    @BeforeEach
    void setUp() {
        academicYearMapper = new AcademicYearMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAcademicYearSample1();
        var actual = academicYearMapper.toEntity(academicYearMapper.toDto(expected));
        assertAcademicYearAllPropertiesEquals(expected, actual);
    }
}
