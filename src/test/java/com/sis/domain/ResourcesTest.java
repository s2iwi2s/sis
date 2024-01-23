package com.sis.domain;

import static com.sis.domain.AssessmentTestSamples.*;
import static com.sis.domain.ResourcesTestSamples.*;
import static com.sis.domain.StrategiesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ResourcesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Resources.class);
        Resources resources1 = getResourcesSample1();
        Resources resources2 = new Resources();
        assertThat(resources1).isNotEqualTo(resources2);

        resources2.setId(resources1.getId());
        assertThat(resources1).isEqualTo(resources2);

        resources2 = getResourcesSample2();
        assertThat(resources1).isNotEqualTo(resources2);
    }

    @Test
    void strategiesTest() throws Exception {
        Resources resources = getResourcesRandomSampleGenerator();
        Strategies strategiesBack = getStrategiesRandomSampleGenerator();

        resources.addStrategies(strategiesBack);
        assertThat(resources.getStrategies()).containsOnly(strategiesBack);
        assertThat(strategiesBack.getResources()).containsOnly(resources);

        resources.removeStrategies(strategiesBack);
        assertThat(resources.getStrategies()).doesNotContain(strategiesBack);
        assertThat(strategiesBack.getResources()).doesNotContain(resources);

        resources.strategies(new HashSet<>(Set.of(strategiesBack)));
        assertThat(resources.getStrategies()).containsOnly(strategiesBack);
        assertThat(strategiesBack.getResources()).containsOnly(resources);

        resources.setStrategies(new HashSet<>());
        assertThat(resources.getStrategies()).doesNotContain(strategiesBack);
        assertThat(strategiesBack.getResources()).doesNotContain(resources);
    }

    @Test
    void assessmentTest() throws Exception {
        Resources resources = getResourcesRandomSampleGenerator();
        Assessment assessmentBack = getAssessmentRandomSampleGenerator();

        resources.addAssessment(assessmentBack);
        assertThat(resources.getAssessments()).containsOnly(assessmentBack);
        assertThat(assessmentBack.getResources()).containsOnly(resources);

        resources.removeAssessment(assessmentBack);
        assertThat(resources.getAssessments()).doesNotContain(assessmentBack);
        assertThat(assessmentBack.getResources()).doesNotContain(resources);

        resources.assessments(new HashSet<>(Set.of(assessmentBack)));
        assertThat(resources.getAssessments()).containsOnly(assessmentBack);
        assertThat(assessmentBack.getResources()).containsOnly(resources);

        resources.setAssessments(new HashSet<>());
        assertThat(resources.getAssessments()).doesNotContain(assessmentBack);
        assertThat(assessmentBack.getResources()).doesNotContain(resources);
    }
}
