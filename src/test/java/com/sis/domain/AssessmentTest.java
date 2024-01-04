package com.sis.domain;

import static com.sis.domain.AssessmentTestSamples.*;
import static com.sis.domain.LearningCompetencyTestSamples.*;
import static com.sis.domain.ResourcesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AssessmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Assessment.class);
        Assessment assessment1 = getAssessmentSample1();
        Assessment assessment2 = new Assessment();
        assertThat(assessment1).isNotEqualTo(assessment2);

        assessment2.setId(assessment1.getId());
        assertThat(assessment1).isEqualTo(assessment2);

        assessment2 = getAssessmentSample2();
        assertThat(assessment1).isNotEqualTo(assessment2);
    }

    @Test
    void resourcesTest() throws Exception {
        Assessment assessment = getAssessmentRandomSampleGenerator();
        Resources resourcesBack = getResourcesRandomSampleGenerator();

        assessment.addResources(resourcesBack);
        assertThat(assessment.getResources()).containsOnly(resourcesBack);
        assertThat(resourcesBack.getAssessment()).isEqualTo(assessment);

        assessment.removeResources(resourcesBack);
        assertThat(assessment.getResources()).doesNotContain(resourcesBack);
        assertThat(resourcesBack.getAssessment()).isNull();

        assessment.resources(new HashSet<>(Set.of(resourcesBack)));
        assertThat(assessment.getResources()).containsOnly(resourcesBack);
        assertThat(resourcesBack.getAssessment()).isEqualTo(assessment);

        assessment.setResources(new HashSet<>());
        assertThat(assessment.getResources()).doesNotContain(resourcesBack);
        assertThat(resourcesBack.getAssessment()).isNull();
    }

    @Test
    void learningCompetencyTest() throws Exception {
        Assessment assessment = getAssessmentRandomSampleGenerator();
        LearningCompetency learningCompetencyBack = getLearningCompetencyRandomSampleGenerator();

        assessment.setLearningCompetency(learningCompetencyBack);
        assertThat(assessment.getLearningCompetency()).isEqualTo(learningCompetencyBack);

        assessment.learningCompetency(null);
        assertThat(assessment.getLearningCompetency()).isNull();
    }
}
