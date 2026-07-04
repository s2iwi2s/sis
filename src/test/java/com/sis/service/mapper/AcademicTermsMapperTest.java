package com.sis.service.mapper;

import static com.sis.domain.AcademicTermsAsserts.*;
import static com.sis.domain.AcademicTermsTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AcademicTermsMapperTest {

    private AcademicTermsMapper academicTermsMapper;

    @BeforeEach
    void setUp() {
        academicTermsMapper = new AcademicTermsMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAcademicTermsSample1();
        var actual = academicTermsMapper.toEntity(academicTermsMapper.toDto(expected));
        assertAcademicTermsAllPropertiesEquals(expected, actual);
    }
}
