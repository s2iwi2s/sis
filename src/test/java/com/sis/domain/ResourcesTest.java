package com.sis.domain;

import static com.sis.domain.AssessmentTestSamples.*;
import static com.sis.domain.ResourcesTestSamples.*;
import static com.sis.domain.StrategiesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
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

        resources.setStrategies(strategiesBack);
        assertThat(resources.getStrategies()).isEqualTo(strategiesBack);

        resources.strategies(null);
        assertThat(resources.getStrategies()).isNull();
    }

    @Test
    void assessmentTest() throws Exception {
        Resources resources = getResourcesRandomSampleGenerator();
        Assessment assessmentBack = getAssessmentRandomSampleGenerator();

        resources.setAssessment(assessmentBack);
        assertThat(resources.getAssessment()).isEqualTo(assessmentBack);

        resources.assessment(null);
        assertThat(resources.getAssessment()).isNull();
    }
}
