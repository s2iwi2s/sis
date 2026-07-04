package com.sis.domain;

import static com.sis.domain.AcademicYearTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AcademicYearTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AcademicYear.class);
        AcademicYear academicYear1 = getAcademicYearSample1();
        AcademicYear academicYear2 = new AcademicYear();
        assertThat(academicYear1).isNotEqualTo(academicYear2);

        academicYear2.setId(academicYear1.getId());
        assertThat(academicYear1).isEqualTo(academicYear2);

        academicYear2 = getAcademicYearSample2();
        assertThat(academicYear1).isNotEqualTo(academicYear2);
    }
}
