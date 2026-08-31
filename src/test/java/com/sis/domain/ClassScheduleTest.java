package com.sis.domain;

import static com.sis.domain.AcademicTermsTestSamples.*;
import static com.sis.domain.AcademicYearTestSamples.*;
import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.ClassScheduleTestSamples.*;
import static com.sis.domain.CourseScheduleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClassScheduleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClassSchedule.class);
        ClassSchedule classSchedule1 = getClassScheduleSample1();
        ClassSchedule classSchedule2 = new ClassSchedule();
        assertThat(classSchedule1).isNotEqualTo(classSchedule2);

        classSchedule2.setId(classSchedule1.getId());
        assertThat(classSchedule1).isEqualTo(classSchedule2);

        classSchedule2 = getClassScheduleSample2();
        assertThat(classSchedule1).isNotEqualTo(classSchedule2);
    }

    @Test
    void gradelevelTest() {
        ClassSchedule classSchedule = getClassScheduleRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        classSchedule.setGradelevel(appConfigBack);
        assertThat(classSchedule.getGradelevel()).isEqualTo(appConfigBack);

        classSchedule.gradelevel(null);
        assertThat(classSchedule.getGradelevel()).isNull();
    }

    @Test
    void courseScheduleTest() {
        ClassSchedule classSchedule = getClassScheduleRandomSampleGenerator();
        CourseSchedule courseScheduleBack = getCourseScheduleRandomSampleGenerator();

        classSchedule.addCourseSchedule(courseScheduleBack);
        assertThat(classSchedule.getCourseSchedules()).containsOnly(courseScheduleBack);
        assertThat(courseScheduleBack.getClassSchedule()).isEqualTo(classSchedule);

        classSchedule.removeCourseSchedule(courseScheduleBack);
        assertThat(classSchedule.getCourseSchedules()).doesNotContain(courseScheduleBack);
        assertThat(courseScheduleBack.getClassSchedule()).isNull();

        classSchedule.courseSchedules(new HashSet<>(Set.of(courseScheduleBack)));
        assertThat(classSchedule.getCourseSchedules()).containsOnly(courseScheduleBack);
        assertThat(courseScheduleBack.getClassSchedule()).isEqualTo(classSchedule);

        classSchedule.setCourseSchedules(new HashSet<>());
        assertThat(classSchedule.getCourseSchedules()).doesNotContain(courseScheduleBack);
        assertThat(courseScheduleBack.getClassSchedule()).isNull();
    }

    @Test
    void termsTest() {
        ClassSchedule classSchedule = getClassScheduleRandomSampleGenerator();
        AcademicTerms academicTermsBack = getAcademicTermsRandomSampleGenerator();

        classSchedule.setTerms(academicTermsBack);
        assertThat(classSchedule.getTerms()).isEqualTo(academicTermsBack);

        classSchedule.terms(null);
        assertThat(classSchedule.getTerms()).isNull();
    }

    @Test
    void yearTest() {
        ClassSchedule classSchedule = getClassScheduleRandomSampleGenerator();
        AcademicYear academicYearBack = getAcademicYearRandomSampleGenerator();

        classSchedule.setYear(academicYearBack);
        assertThat(classSchedule.getYear()).isEqualTo(academicYearBack);

        classSchedule.year(null);
        assertThat(classSchedule.getYear()).isNull();
    }
}
