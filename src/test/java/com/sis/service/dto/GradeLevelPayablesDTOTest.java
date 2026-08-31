package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GradeLevelPayablesDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GradeLevelPayablesDTO.class);
        GradeLevelPayablesDTO gradeLevelPayablesDTO1 = new GradeLevelPayablesDTO();
        gradeLevelPayablesDTO1.setId(1L);
        GradeLevelPayablesDTO gradeLevelPayablesDTO2 = new GradeLevelPayablesDTO();
        assertThat(gradeLevelPayablesDTO1).isNotEqualTo(gradeLevelPayablesDTO2);
        gradeLevelPayablesDTO2.setId(gradeLevelPayablesDTO1.getId());
        assertThat(gradeLevelPayablesDTO1).isEqualTo(gradeLevelPayablesDTO2);
        gradeLevelPayablesDTO2.setId(2L);
        assertThat(gradeLevelPayablesDTO1).isNotEqualTo(gradeLevelPayablesDTO2);
        gradeLevelPayablesDTO1.setId(null);
        assertThat(gradeLevelPayablesDTO1).isNotEqualTo(gradeLevelPayablesDTO2);
    }
}
