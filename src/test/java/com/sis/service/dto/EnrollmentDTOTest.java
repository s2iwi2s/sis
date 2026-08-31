package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnrollmentDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(EnrollmentDTO.class);
        EnrollmentDTO enrollmentDTO1 = new EnrollmentDTO();
        enrollmentDTO1.setId(1L);
        EnrollmentDTO enrollmentDTO2 = new EnrollmentDTO();
        assertThat(enrollmentDTO1).isNotEqualTo(enrollmentDTO2);
        enrollmentDTO2.setId(enrollmentDTO1.getId());
        assertThat(enrollmentDTO1).isEqualTo(enrollmentDTO2);
        enrollmentDTO2.setId(2L);
        assertThat(enrollmentDTO1).isNotEqualTo(enrollmentDTO2);
        enrollmentDTO1.setId(null);
        assertThat(enrollmentDTO1).isNotEqualTo(enrollmentDTO2);
    }
}
