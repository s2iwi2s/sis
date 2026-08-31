package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseScheduleTestSamples.*;
import static com.sis.domain.EnrollmentTestSamples.*;
import static com.sis.domain.InvoicesTestSamples.*;
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
    void genderTest() {
        Student student = getStudentRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        student.setGender(appConfigBack);
        assertThat(student.getGender()).isEqualTo(appConfigBack);

        student.gender(null);
        assertThat(student.getGender()).isNull();
    }

    @Test
    void invoicesTest() {
        Student student = getStudentRandomSampleGenerator();
        Invoices invoicesBack = getInvoicesRandomSampleGenerator();

        student.addInvoices(invoicesBack);
        assertThat(student.getInvoiceses()).containsOnly(invoicesBack);
        assertThat(invoicesBack.getStudent()).isEqualTo(student);

        student.removeInvoices(invoicesBack);
        assertThat(student.getInvoiceses()).doesNotContain(invoicesBack);
        assertThat(invoicesBack.getStudent()).isNull();

        student.invoiceses(new HashSet<>(Set.of(invoicesBack)));
        assertThat(student.getInvoiceses()).containsOnly(invoicesBack);
        assertThat(invoicesBack.getStudent()).isEqualTo(student);

        student.setInvoiceses(new HashSet<>());
        assertThat(student.getInvoiceses()).doesNotContain(invoicesBack);
        assertThat(invoicesBack.getStudent()).isNull();
    }

    @Test
    void courseScheduleTest() {
        Student student = getStudentRandomSampleGenerator();
        CourseSchedule courseScheduleBack = getCourseScheduleRandomSampleGenerator();

        student.addCourseSchedule(courseScheduleBack);
        assertThat(student.getCourseSchedules()).containsOnly(courseScheduleBack);

        student.removeCourseSchedule(courseScheduleBack);
        assertThat(student.getCourseSchedules()).doesNotContain(courseScheduleBack);

        student.courseSchedules(new HashSet<>(Set.of(courseScheduleBack)));
        assertThat(student.getCourseSchedules()).containsOnly(courseScheduleBack);

        student.setCourseSchedules(new HashSet<>());
        assertThat(student.getCourseSchedules()).doesNotContain(courseScheduleBack);
    }

    @Test
    void enrollmentTest() {
        Student student = getStudentRandomSampleGenerator();
        Enrollment enrollmentBack = getEnrollmentRandomSampleGenerator();

        student.addEnrollment(enrollmentBack);
        assertThat(student.getEnrollments()).containsOnly(enrollmentBack);
        assertThat(enrollmentBack.getStudent()).isEqualTo(student);

        student.removeEnrollment(enrollmentBack);
        assertThat(student.getEnrollments()).doesNotContain(enrollmentBack);
        assertThat(enrollmentBack.getStudent()).isNull();

        student.enrollments(new HashSet<>(Set.of(enrollmentBack)));
        assertThat(student.getEnrollments()).containsOnly(enrollmentBack);
        assertThat(enrollmentBack.getStudent()).isEqualTo(student);

        student.setEnrollments(new HashSet<>());
        assertThat(student.getEnrollments()).doesNotContain(enrollmentBack);
        assertThat(enrollmentBack.getStudent()).isNull();
    }
}
