package com.sis.domain;

import static com.sis.domain.AcademicTermsTestSamples.*;
import static com.sis.domain.AcademicYearTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AcademicTermsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AcademicTerms.class);
        AcademicTerms academicTerms1 = getAcademicTermsSample1();
        AcademicTerms academicTerms2 = new AcademicTerms();
        assertThat(academicTerms1).isNotEqualTo(academicTerms2);

        academicTerms2.setId(academicTerms1.getId());
        assertThat(academicTerms1).isEqualTo(academicTerms2);

        academicTerms2 = getAcademicTermsSample2();
        assertThat(academicTerms1).isNotEqualTo(academicTerms2);
    }

    @Test
    void yearTest() {
        AcademicTerms academicTerms = getAcademicTermsRandomSampleGenerator();
        AcademicYear academicYearBack = getAcademicYearRandomSampleGenerator();

        academicTerms.setYear(academicYearBack);
        assertThat(academicTerms.getYear()).isEqualTo(academicYearBack);

        academicTerms.year(null);
        assertThat(academicTerms.getYear()).isNull();
    }
}
