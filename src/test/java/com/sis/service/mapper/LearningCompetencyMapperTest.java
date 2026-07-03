package com.sis.service.mapper;

import static com.sis.domain.LearningCompetencyAsserts.*;
import static com.sis.domain.LearningCompetencyTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LearningCompetencyMapperTest {

    private LearningCompetencyMapper learningCompetencyMapper;

    @BeforeEach
    void setUp() {
        learningCompetencyMapper = new LearningCompetencyMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getLearningCompetencySample1();
        var actual = learningCompetencyMapper.toEntity(learningCompetencyMapper.toDto(expected));
        assertLearningCompetencyAllPropertiesEquals(expected, actual);
    }
}
