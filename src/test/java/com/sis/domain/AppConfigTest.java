package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.InstructorTestSamples.*;
import static com.sis.domain.OrgTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppConfigTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppConfig.class);
        AppConfig appConfig1 = getAppConfigSample1();
        AppConfig appConfig2 = new AppConfig();
        assertThat(appConfig1).isNotEqualTo(appConfig2);

        appConfig2.setId(appConfig1.getId());
        assertThat(appConfig1).isEqualTo(appConfig2);

        appConfig2 = getAppConfigSample2();
        assertThat(appConfig1).isNotEqualTo(appConfig2);
    }

    @Test
    void orgTest() throws Exception {
        AppConfig appConfig = getAppConfigRandomSampleGenerator();
        Org orgBack = getOrgRandomSampleGenerator();

        appConfig.setOrg(orgBack);
        assertThat(appConfig.getOrg()).isEqualTo(orgBack);
        assertThat(orgBack.getCurrSchYr()).isEqualTo(appConfig);

        appConfig.org(null);
        assertThat(appConfig.getOrg()).isNull();
        assertThat(orgBack.getCurrSchYr()).isNull();
    }

    @Test
    void instructorTest() throws Exception {
        AppConfig appConfig = getAppConfigRandomSampleGenerator();
        Instructor instructorBack = getInstructorRandomSampleGenerator();

        appConfig.setInstructor(instructorBack);
        assertThat(appConfig.getInstructor()).isEqualTo(instructorBack);
        assertThat(instructorBack.getGender()).isEqualTo(appConfig);

        appConfig.instructor(null);
        assertThat(appConfig.getInstructor()).isNull();
        assertThat(instructorBack.getGender()).isNull();
    }

    @Test
    void studentTest() throws Exception {
        AppConfig appConfig = getAppConfigRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        appConfig.setStudent(studentBack);
        assertThat(appConfig.getStudent()).isEqualTo(studentBack);
        assertThat(studentBack.getGender()).isEqualTo(appConfig);

        appConfig.student(null);
        assertThat(appConfig.getStudent()).isNull();
        assertThat(studentBack.getGender()).isNull();
    }

    @Test
    void courseTest() throws Exception {
        AppConfig appConfig = getAppConfigRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        appConfig.setCourse(courseBack);
        assertThat(appConfig.getCourse()).isEqualTo(courseBack);
        assertThat(courseBack.getSchYr()).isEqualTo(appConfig);

        appConfig.course(null);
        assertThat(appConfig.getCourse()).isNull();
        assertThat(courseBack.getSchYr()).isNull();
    }
}
