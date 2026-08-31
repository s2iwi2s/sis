package com.sis.domain;

import static com.sis.domain.AcademicTermsTestSamples.*;
import static com.sis.domain.AcademicYearTestSamples.*;
import static com.sis.domain.ClassScheduleTestSamples.*;
import static com.sis.domain.CourseScheduleTestSamples.*;
import static com.sis.domain.InstructorTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
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
    void classScheduleTest() {
        CourseSchedule courseSchedule = getCourseScheduleRandomSampleGenerator();
        ClassSchedule classScheduleBack = getClassScheduleRandomSampleGenerator();

        courseSchedule.setClassSchedule(classScheduleBack);
        assertThat(courseSchedule.getClassSchedule()).isEqualTo(classScheduleBack);

        courseSchedule.classSchedule(null);
        assertThat(courseSchedule.getClassSchedule()).isNull();
    }

    @Test
    void studentTest() {
        CourseSchedule courseSchedule = getCourseScheduleRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        courseSchedule.addStudent(studentBack);
        assertThat(courseSchedule.getStudents()).containsOnly(studentBack);
        assertThat(studentBack.getCourseSchedules()).containsOnly(courseSchedule);

        courseSchedule.removeStudent(studentBack);
        assertThat(courseSchedule.getStudents()).doesNotContain(studentBack);
        assertThat(studentBack.getCourseSchedules()).doesNotContain(courseSchedule);

        courseSchedule.students(new HashSet<>(Set.of(studentBack)));
        assertThat(courseSchedule.getStudents()).containsOnly(studentBack);
        assertThat(studentBack.getCourseSchedules()).containsOnly(courseSchedule);

        courseSchedule.setStudents(new HashSet<>());
        assertThat(courseSchedule.getStudents()).doesNotContain(studentBack);
        assertThat(studentBack.getCourseSchedules()).doesNotContain(courseSchedule);
    }

    @Test
    void instructorTest() {
        CourseSchedule courseSchedule = getCourseScheduleRandomSampleGenerator();
        Instructor instructorBack = getInstructorRandomSampleGenerator();

        courseSchedule.addInstructor(instructorBack);
        assertThat(courseSchedule.getInstructors()).containsOnly(instructorBack);
        assertThat(instructorBack.getCourseSchedules()).containsOnly(courseSchedule);

        courseSchedule.removeInstructor(instructorBack);
        assertThat(courseSchedule.getInstructors()).doesNotContain(instructorBack);
        assertThat(instructorBack.getCourseSchedules()).doesNotContain(courseSchedule);

        courseSchedule.instructors(new HashSet<>(Set.of(instructorBack)));
        assertThat(courseSchedule.getInstructors()).containsOnly(instructorBack);
        assertThat(instructorBack.getCourseSchedules()).containsOnly(courseSchedule);

        courseSchedule.setInstructors(new HashSet<>());
        assertThat(courseSchedule.getInstructors()).doesNotContain(instructorBack);
        assertThat(instructorBack.getCourseSchedules()).doesNotContain(courseSchedule);
    }
}
