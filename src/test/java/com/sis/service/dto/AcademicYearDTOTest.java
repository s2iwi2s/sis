package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AcademicYearDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AcademicYearDTO.class);
        AcademicYearDTO academicYearDTO1 = new AcademicYearDTO();
        academicYearDTO1.setId(1L);
        AcademicYearDTO academicYearDTO2 = new AcademicYearDTO();
        assertThat(academicYearDTO1).isNotEqualTo(academicYearDTO2);
        academicYearDTO2.setId(academicYearDTO1.getId());
        assertThat(academicYearDTO1).isEqualTo(academicYearDTO2);
        academicYearDTO2.setId(2L);
        assertThat(academicYearDTO1).isNotEqualTo(academicYearDTO2);
        academicYearDTO1.setId(null);
        assertThat(academicYearDTO1).isNotEqualTo(academicYearDTO2);
    }
}
