package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.InstructorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class InstructorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Instructor.class);
        Instructor instructor1 = getInstructorSample1();
        Instructor instructor2 = new Instructor();
        assertThat(instructor1).isNotEqualTo(instructor2);

        instructor2.setId(instructor1.getId());
        assertThat(instructor1).isEqualTo(instructor2);

        instructor2 = getInstructorSample2();
        assertThat(instructor1).isNotEqualTo(instructor2);
    }

    @Test
    void genderTest() throws Exception {
        Instructor instructor = getInstructorRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        instructor.setGender(appConfigBack);
        assertThat(instructor.getGender()).isEqualTo(appConfigBack);

        instructor.gender(null);
        assertThat(instructor.getGender()).isNull();
    }

    @Test
    void courseTest() throws Exception {
        Instructor instructor = getInstructorRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        instructor.addCourse(courseBack);
        assertThat(instructor.getCourses()).containsOnly(courseBack);

        instructor.removeCourse(courseBack);
        assertThat(instructor.getCourses()).doesNotContain(courseBack);

        instructor.courses(new HashSet<>(Set.of(courseBack)));
        assertThat(instructor.getCourses()).containsOnly(courseBack);

        instructor.setCourses(new HashSet<>());
        assertThat(instructor.getCourses()).doesNotContain(courseBack);
    }
}
