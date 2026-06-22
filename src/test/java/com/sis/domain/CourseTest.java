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
    void gradelevelTest() throws Exception {
        Course course = getCourseRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        course.setGradelevel(appConfigBack);
        assertThat(course.getGradelevel()).isEqualTo(appConfigBack);

        course.gradelevel(null);
        assertThat(course.getGradelevel()).isNull();
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

//        course.addInstructor(instructorBack);
//        assertThat(course.getInstructors()).containsOnly(instructorBack);
//        assertThat(instructorBack.getCourses()).containsOnly(course);
//
//        course.removeInstructor(instructorBack);
//        assertThat(course.getInstructors()).doesNotContain(instructorBack);
//        assertThat(instructorBack.getCourses()).doesNotContain(course);
//
//        course.instructors(new HashSet<>(Set.of(instructorBack)));
//        assertThat(course.getInstructors()).containsOnly(instructorBack);
//        assertThat(instructorBack.getCourses()).containsOnly(course);
//
//        course.setInstructors(new HashSet<>());
//        assertThat(course.getInstructors()).doesNotContain(instructorBack);
//        assertThat(instructorBack.getCourses()).doesNotContain(course);
    }

    @Test
    void studentTest() throws Exception {
        Course course = getCourseRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

//        course.addStudent(studentBack);
//        assertThat(course.getStudents()).containsOnly(studentBack);
//        assertThat(studentBack.getCourses()).containsOnly(course);
//
//        course.removeStudent(studentBack);
//        assertThat(course.getStudents()).doesNotContain(studentBack);
//        assertThat(studentBack.getCourses()).doesNotContain(course);
//
//        course.students(new HashSet<>(Set.of(studentBack)));
//        assertThat(course.getStudents()).containsOnly(studentBack);
//        assertThat(studentBack.getCourses()).containsOnly(course);
//
//        course.setStudents(new HashSet<>());
//        assertThat(course.getStudents()).doesNotContain(studentBack);
//        assertThat(studentBack.getCourses()).doesNotContain(course);
    }
}
