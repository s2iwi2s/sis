package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.CurriculumMapTestSamples.*;
import static com.sis.domain.InstructorTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CourseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Course.class);
        Course course1 = getCourseSample1();
        Course course2 = new Course();
        assertThat(course1).isNotEqualTo(course2);

        course2.setId(course1.getId());
        assertThat(course1).isEqualTo(course2);

        course2 = getCourseSample2();
        assertThat(course1).isNotEqualTo(course2);
    }

    @Test
    void schYrTest() throws Exception {
        Course course = getCourseRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        course.setSchYr(appConfigBack);
        assertThat(course.getSchYr()).isEqualTo(appConfigBack);

        course.schYr(null);
        assertThat(course.getSchYr()).isNull();
    }

    @Test
    void curriculumMapTest() throws Exception {
        Course course = getCourseRandomSampleGenerator();
        CurriculumMap curriculumMapBack = getCurriculumMapRandomSampleGenerator();

        course.addCurriculumMap(curriculumMapBack);
        assertThat(course.getCurriculumMaps()).containsOnly(curriculumMapBack);
        assertThat(curriculumMapBack.getCourse()).isEqualTo(course);

        course.removeCurriculumMap(curriculumMapBack);
        assertThat(course.getCurriculumMaps()).doesNotContain(curriculumMapBack);
        assertThat(curriculumMapBack.getCourse()).isNull();

        course.curriculumMaps(new HashSet<>(Set.of(curriculumMapBack)));
        assertThat(course.getCurriculumMaps()).containsOnly(curriculumMapBack);
        assertThat(curriculumMapBack.getCourse()).isEqualTo(course);

        course.setCurriculumMaps(new HashSet<>());
        assertThat(course.getCurriculumMaps()).doesNotContain(curriculumMapBack);
        assertThat(curriculumMapBack.getCourse()).isNull();
    }

    @Test
    void instructorTest() throws Exception {
        Course course = getCourseRandomSampleGenerator();
        Instructor instructorBack = getInstructorRandomSampleGenerator();

        course.addInstructor(instructorBack);
        assertThat(course.getInstructors()).containsOnly(instructorBack);

        course.removeInstructor(instructorBack);
        assertThat(course.getInstructors()).doesNotContain(instructorBack);

        course.instructors(new HashSet<>(Set.of(instructorBack)));
        assertThat(course.getInstructors()).containsOnly(instructorBack);

        course.setInstructors(new HashSet<>());
        assertThat(course.getInstructors()).doesNotContain(instructorBack);
    }

    @Test
    void studentTest() throws Exception {
        Course course = getCourseRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        course.addStudent(studentBack);
        assertThat(course.getStudents()).containsOnly(studentBack);

        course.removeStudent(studentBack);
        assertThat(course.getStudents()).doesNotContain(studentBack);

        course.students(new HashSet<>(Set.of(studentBack)));
        assertThat(course.getStudents()).containsOnly(studentBack);

        course.setStudents(new HashSet<>());
        assertThat(course.getStudents()).doesNotContain(studentBack);
    }
}
