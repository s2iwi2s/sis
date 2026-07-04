package com.sis.service.mapper;

import static com.sis.domain.AssessmentAsserts.*;
import static com.sis.domain.AssessmentTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AssessmentMapperTest {

    private AssessmentMapper assessmentMapper;

    @BeforeEach
    void setUp() {
        assessmentMapper = new AssessmentMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAssessmentSample1();
        var actual = assessmentMapper.toEntity(assessmentMapper.toDto(expected));
        assertAssessmentAllPropertiesEquals(expected, actual);
    }
}
