package com.sis.domain;

import static com.sis.domain.LearningCompetencyTestSamples.*;
import static com.sis.domain.ResourcesTestSamples.*;
import static com.sis.domain.StrategiesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class StrategiesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Strategies.class);
        Strategies strategies1 = getStrategiesSample1();
        Strategies strategies2 = new Strategies();
        assertThat(strategies1).isNotEqualTo(strategies2);

        strategies2.setId(strategies1.getId());
        assertThat(strategies1).isEqualTo(strategies2);

        strategies2 = getStrategiesSample2();
        assertThat(strategies1).isNotEqualTo(strategies2);
    }

    @Test
    void resourcesTest() throws Exception {
        Strategies strategies = getStrategiesRandomSampleGenerator();
        Resources resourcesBack = getResourcesRandomSampleGenerator();

        strategies.addResources(resourcesBack);
        assertThat(strategies.getResources()).containsOnly(resourcesBack);
        assertThat(resourcesBack.getStrategies()).isEqualTo(strategies);

        strategies.removeResources(resourcesBack);
        assertThat(strategies.getResources()).doesNotContain(resourcesBack);
        assertThat(resourcesBack.getStrategies()).isNull();

        strategies.resources(new HashSet<>(Set.of(resourcesBack)));
        assertThat(strategies.getResources()).containsOnly(resourcesBack);
        assertThat(resourcesBack.getStrategies()).isEqualTo(strategies);

        strategies.setResources(new HashSet<>());
        assertThat(strategies.getResources()).doesNotContain(resourcesBack);
        assertThat(resourcesBack.getStrategies()).isNull();
    }

    @Test
    void learningCompetencyTest() throws Exception {
        Strategies strategies = getStrategiesRandomSampleGenerator();
        LearningCompetency learningCompetencyBack = getLearningCompetencyRandomSampleGenerator();

        strategies.setLearningCompetency(learningCompetencyBack);
        assertThat(strategies.getLearningCompetency()).isEqualTo(learningCompetencyBack);

        strategies.learningCompetency(null);
        assertThat(strategies.getLearningCompetency()).isNull();
    }
}
