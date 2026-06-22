package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class StudentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Student.class);
        Student student1 = getStudentSample1();
        Student student2 = new Student();
        assertThat(student1).isNotEqualTo(student2);

        student2.setId(student1.getId());
        assertThat(student1).isEqualTo(student2);

        student2 = getStudentSample2();
        assertThat(student1).isNotEqualTo(student2);
    }

    @Test
    void genderTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        student.setGender(appConfigBack);
        assertThat(student.getGender()).isEqualTo(appConfigBack);

        student.gender(null);
        assertThat(student.getGender()).isNull();
    }

    @Test
    void courseTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        student.addCourse(courseBack);
        assertThat(student.getCourses()).containsOnly(courseBack);

        student.removeCourse(courseBack);
        assertThat(student.getCourses()).doesNotContain(courseBack);

        student.courses(new HashSet<>(Set.of(courseBack)));
        assertThat(student.getCourses()).containsOnly(courseBack);

        student.setCourses(new HashSet<>());
        assertThat(student.getCourses()).doesNotContain(courseBack);
    }
}
