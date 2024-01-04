package com.sis.domain;

import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.CurriculumMapTestSamples.*;
import static com.sis.domain.LearningCompetencyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CurriculumMapTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CurriculumMap.class);
        CurriculumMap curriculumMap1 = getCurriculumMapSample1();
        CurriculumMap curriculumMap2 = new CurriculumMap();
        assertThat(curriculumMap1).isNotEqualTo(curriculumMap2);

        curriculumMap2.setId(curriculumMap1.getId());
        assertThat(curriculumMap1).isEqualTo(curriculumMap2);

        curriculumMap2 = getCurriculumMapSample2();
        assertThat(curriculumMap1).isNotEqualTo(curriculumMap2);
    }

    @Test
    void learningCompetencyTest() throws Exception {
        CurriculumMap curriculumMap = getCurriculumMapRandomSampleGenerator();
        LearningCompetency learningCompetencyBack = getLearningCompetencyRandomSampleGenerator();

        curriculumMap.addLearningCompetency(learningCompetencyBack);
        assertThat(curriculumMap.getLearningCompetencies()).containsOnly(learningCompetencyBack);
        assertThat(learningCompetencyBack.getCurriculumMap()).isEqualTo(curriculumMap);

        curriculumMap.removeLearningCompetency(learningCompetencyBack);
        assertThat(curriculumMap.getLearningCompetencies()).doesNotContain(learningCompetencyBack);
        assertThat(learningCompetencyBack.getCurriculumMap()).isNull();

        curriculumMap.learningCompetencies(new HashSet<>(Set.of(learningCompetencyBack)));
        assertThat(curriculumMap.getLearningCompetencies()).containsOnly(learningCompetencyBack);
        assertThat(learningCompetencyBack.getCurriculumMap()).isEqualTo(curriculumMap);

        curriculumMap.setLearningCompetencies(new HashSet<>());
        assertThat(curriculumMap.getLearningCompetencies()).doesNotContain(learningCompetencyBack);
        assertThat(learningCompetencyBack.getCurriculumMap()).isNull();
    }

    @Test
    void courseTest() throws Exception {
        CurriculumMap curriculumMap = getCurriculumMapRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        curriculumMap.setCourse(courseBack);
        assertThat(curriculumMap.getCourse()).isEqualTo(courseBack);

        curriculumMap.course(null);
        assertThat(curriculumMap.getCourse()).isNull();
    }
}
