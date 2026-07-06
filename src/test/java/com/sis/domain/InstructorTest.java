package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseScheduleTestSamples.*;
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
    void genderTest() {
        Instructor instructor = getInstructorRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        instructor.setGender(appConfigBack);
        assertThat(instructor.getGender()).isEqualTo(appConfigBack);

        instructor.gender(null);
        assertThat(instructor.getGender()).isNull();
    }

    @Test
    void courseScheduleTest() {
        Instructor instructor = getInstructorRandomSampleGenerator();
        CourseSchedule courseScheduleBack = getCourseScheduleRandomSampleGenerator();

        instructor.addCourseSchedule(courseScheduleBack);
        assertThat(instructor.getCourseSchedules()).containsOnly(courseScheduleBack);

        instructor.removeCourseSchedule(courseScheduleBack);
        assertThat(instructor.getCourseSchedules()).doesNotContain(courseScheduleBack);

        instructor.courseSchedules(new HashSet<>(Set.of(courseScheduleBack)));
        assertThat(instructor.getCourseSchedules()).containsOnly(courseScheduleBack);

        instructor.setCourseSchedules(new HashSet<>());
        assertThat(instructor.getCourseSchedules()).doesNotContain(courseScheduleBack);
    }
}
