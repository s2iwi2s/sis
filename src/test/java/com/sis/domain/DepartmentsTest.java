package com.sis.domain;

import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.DepartmentsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DepartmentsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Departments.class);
        Departments departments1 = getDepartmentsSample1();
        Departments departments2 = new Departments();
        assertThat(departments1).isNotEqualTo(departments2);

        departments2.setId(departments1.getId());
        assertThat(departments1).isEqualTo(departments2);

        departments2 = getDepartmentsSample2();
        assertThat(departments1).isNotEqualTo(departments2);
    }
}
