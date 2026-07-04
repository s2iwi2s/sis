package com.sis.domain;

import static com.sis.domain.AcademicTermsTestSamples.*;
import static com.sis.domain.AcademicYearTestSamples.*;
import static com.sis.domain.CourseScheduleTestSamples.*;
import static com.sis.domain.InstructorTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CourseScheduleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CourseSchedule.class);
        CourseSchedule courseSchedule1 = getCourseScheduleSample1();
        CourseSchedule courseSchedule2 = new CourseSchedule();
        assertThat(courseSchedule1).isNotEqualTo(courseSchedule2);

        courseSchedule2.setId(courseSchedule1.getId());
        assertThat(courseSchedule1).isEqualTo(courseSchedule2);

        courseSchedule2 = getCourseScheduleSample2();
        assertThat(courseSchedule1).isNotEqualTo(courseSchedule2);
    }

    @Test
    void termsTest() {
        CourseSchedule courseSchedule = getCourseScheduleRandomSampleGenerator();
        AcademicTerms academicTermsBack = getAcademicTermsRandomSampleGenerator();

        courseSchedule.setTerms(academicTermsBack);
        assertThat(courseSchedule.getTerms()).isEqualTo(academicTermsBack);

        courseSchedule.terms(null);
        assertThat(courseSchedule.getTerms()).isNull();
    }

    @Test
    void yearTest() {
        CourseSchedule courseSchedule = getCourseScheduleRandomSampleGenerator();
        AcademicYear academicYearBack = getAcademicYearRandomSampleGenerator();

        courseSchedule.setYear(academicYearBack);
        assertThat(courseSchedule.getYear()).isEqualTo(academicYearBack);

        courseSchedule.year(null);
        assertThat(courseSchedule.getYear()).isNull();
    }

    @Test
    void instructorTest() {
        CourseSchedule courseSchedule = getCourseScheduleRandomSampleGenerator();
        Instructor instructorBack = getInstructorRandomSampleGenerator();

        courseSchedule.setInstructor(instructorBack);
        assertThat(courseSchedule.getInstructor()).isEqualTo(instructorBack);

        courseSchedule.instructor(null);
        assertThat(courseSchedule.getInstructor()).isNull();
    }

    @Test
    void studentTest() {
        CourseSchedule courseSchedule = getCourseScheduleRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        courseSchedule.setStudent(studentBack);
        assertThat(courseSchedule.getStudent()).isEqualTo(studentBack);

        courseSchedule.student(null);
        assertThat(courseSchedule.getStudent()).isNull();
    }
}
