package com.sis.domain;

import static com.sis.domain.AcademicTermsTestSamples.*;
import static com.sis.domain.AcademicYearTestSamples.*;
import static com.sis.domain.EnrollmentTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnrollmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Enrollment.class);
        Enrollment enrollment1 = getEnrollmentSample1();
        Enrollment enrollment2 = new Enrollment();
        assertThat(enrollment1).isNotEqualTo(enrollment2);

        enrollment2.setId(enrollment1.getId());
        assertThat(enrollment1).isEqualTo(enrollment2);

        enrollment2 = getEnrollmentSample2();
        assertThat(enrollment1).isNotEqualTo(enrollment2);
    }

    @Test
    void yearTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        AcademicYear academicYearBack = getAcademicYearRandomSampleGenerator();

        enrollment.setYear(academicYearBack);
        assertThat(enrollment.getYear()).isEqualTo(academicYearBack);

        enrollment.year(null);
        assertThat(enrollment.getYear()).isNull();
    }

    @Test
    void termsTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        AcademicTerms academicTermsBack = getAcademicTermsRandomSampleGenerator();

        enrollment.setTerms(academicTermsBack);
        assertThat(enrollment.getTerms()).isEqualTo(academicTermsBack);

        enrollment.terms(null);
        assertThat(enrollment.getTerms()).isNull();
    }

    @Test
    void studentTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        enrollment.setStudent(studentBack);
        assertThat(enrollment.getStudent()).isEqualTo(studentBack);

        enrollment.student(null);
        assertThat(enrollment.getStudent()).isNull();
    }
}
