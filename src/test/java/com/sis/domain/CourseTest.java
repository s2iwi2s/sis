package com.sis.domain;

import static com.sis.domain.AcademicTermsTestSamples.*;
import static com.sis.domain.AcademicYearTestSamples.*;
import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.CurriculumMapTestSamples.*;
import static com.sis.domain.DepartmentsTestSamples.*;
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
    void gradelevelTest() {
        Course course = getCourseRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        course.setGradelevel(appConfigBack);
        assertThat(course.getGradelevel()).isEqualTo(appConfigBack);

        course.gradelevel(null);
        assertThat(course.getGradelevel()).isNull();
    }

    @Test
    void departmentTest() {
        Course course = getCourseRandomSampleGenerator();
        Departments departmentsBack = getDepartmentsRandomSampleGenerator();

        course.setDepartment(departmentsBack);
        assertThat(course.getDepartment()).isEqualTo(departmentsBack);

        course.department(null);
        assertThat(course.getDepartment()).isNull();
    }

    @Test
    void curriculumMapTest() {
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
    void yearTest() {
        Course course = getCourseRandomSampleGenerator();
        AcademicYear academicYearBack = getAcademicYearRandomSampleGenerator();

        course.setYear(academicYearBack);
        assertThat(course.getYear()).isEqualTo(academicYearBack);

        course.year(null);
        assertThat(course.getYear()).isNull();
    }

    @Test
    void termsTest() {
        Course course = getCourseRandomSampleGenerator();
        AcademicTerms academicTermsBack = getAcademicTermsRandomSampleGenerator();

        course.setTerms(academicTermsBack);
        assertThat(course.getTerms()).isEqualTo(academicTermsBack);

        course.terms(null);
        assertThat(course.getTerms()).isNull();
    }
}
