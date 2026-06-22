package com.sis.domain;

import static com.sis.domain.AssessmentTestSamples.*;
import static com.sis.domain.CurriculumMapTestSamples.*;
import static com.sis.domain.LearningCompetencyTestSamples.*;
import static com.sis.domain.StrategiesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class LearningCompetencyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LearningCompetency.class);
        LearningCompetency learningCompetency1 = getLearningCompetencySample1();
        LearningCompetency learningCompetency2 = new LearningCompetency();
        assertThat(learningCompetency1).isNotEqualTo(learningCompetency2);

        learningCompetency2.setId(learningCompetency1.getId());
        assertThat(learningCompetency1).isEqualTo(learningCompetency2);

        learningCompetency2 = getLearningCompetencySample2();
        assertThat(learningCompetency1).isNotEqualTo(learningCompetency2);
    }

    @Test
    void strategiesTest() throws Exception {
        LearningCompetency learningCompetency = getLearningCompetencyRandomSampleGenerator();
        Strategies strategiesBack = getStrategiesRandomSampleGenerator();

        learningCompetency.addStrategies(strategiesBack);
        assertThat(learningCompetency.getStrategies()).containsOnly(strategiesBack);
        assertThat(strategiesBack.getLearningCompetency()).isEqualTo(learningCompetency);

        learningCompetency.removeStrategies(strategiesBack);
        assertThat(learningCompetency.getStrategies()).doesNotContain(strategiesBack);
        assertThat(strategiesBack.getLearningCompetency()).isNull();

        learningCompetency.strategies(new HashSet<>(Set.of(strategiesBack)));
        assertThat(learningCompetency.getStrategies()).containsOnly(strategiesBack);
        assertThat(strategiesBack.getLearningCompetency()).isEqualTo(learningCompetency);

        learningCompetency.setStrategies(new HashSet<>());
        assertThat(learningCompetency.getStrategies()).doesNotContain(strategiesBack);
        assertThat(strategiesBack.getLearningCompetency()).isNull();
    }

    @Test
    void assessmentTest() throws Exception {
        LearningCompetency learningCompetency = getLearningCompetencyRandomSampleGenerator();
        Assessment assessmentBack = getAssessmentRandomSampleGenerator();

        learningCompetency.addAssessment(assessmentBack);
        assertThat(learningCompetency.getAssessments()).containsOnly(assessmentBack);
        assertThat(assessmentBack.getLearningCompetency()).isEqualTo(learningCompetency);

        learningCompetency.removeAssessment(assessmentBack);
        assertThat(learningCompetency.getAssessments()).doesNotContain(assessmentBack);
        assertThat(assessmentBack.getLearningCompetency()).isNull();

        learningCompetency.assessments(new HashSet<>(Set.of(assessmentBack)));
        assertThat(learningCompetency.getAssessments()).containsOnly(assessmentBack);
        assertThat(assessmentBack.getLearningCompetency()).isEqualTo(learningCompetency);

        learningCompetency.setAssessments(new HashSet<>());
        assertThat(learningCompetency.getAssessments()).doesNotContain(assessmentBack);
        assertThat(assessmentBack.getLearningCompetency()).isNull();
    }

    @Test
    void curriculumMapTest() throws Exception {
        LearningCompetency learningCompetency = getLearningCompetencyRandomSampleGenerator();
        CurriculumMap curriculumMapBack = getCurriculumMapRandomSampleGenerator();

        learningCompetency.setCurriculumMap(curriculumMapBack);
        assertThat(learningCompetency.getCurriculumMap()).isEqualTo(curriculumMapBack);

        learningCompetency.curriculumMap(null);
        assertThat(learningCompetency.getCurriculumMap()).isNull();
    }
}
