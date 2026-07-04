package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AcademicTermsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AcademicTermsDTO.class);
        AcademicTermsDTO academicTermsDTO1 = new AcademicTermsDTO();
        academicTermsDTO1.setId(1L);
        AcademicTermsDTO academicTermsDTO2 = new AcademicTermsDTO();
        assertThat(academicTermsDTO1).isNotEqualTo(academicTermsDTO2);
        academicTermsDTO2.setId(academicTermsDTO1.getId());
        assertThat(academicTermsDTO1).isEqualTo(academicTermsDTO2);
        academicTermsDTO2.setId(2L);
        assertThat(academicTermsDTO1).isNotEqualTo(academicTermsDTO2);
        academicTermsDTO1.setId(null);
        assertThat(academicTermsDTO1).isNotEqualTo(academicTermsDTO2);
    }
}
