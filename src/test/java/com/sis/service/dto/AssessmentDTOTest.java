package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssessmentDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AssessmentDTO.class);
        AssessmentDTO assessmentDTO1 = new AssessmentDTO();
        assessmentDTO1.setId(1L);
        AssessmentDTO assessmentDTO2 = new AssessmentDTO();
        assertThat(assessmentDTO1).isNotEqualTo(assessmentDTO2);
        assessmentDTO2.setId(assessmentDTO1.getId());
        assertThat(assessmentDTO1).isEqualTo(assessmentDTO2);
        assessmentDTO2.setId(2L);
        assertThat(assessmentDTO1).isNotEqualTo(assessmentDTO2);
        assessmentDTO1.setId(null);
        assertThat(assessmentDTO1).isNotEqualTo(assessmentDTO2);
    }
}
