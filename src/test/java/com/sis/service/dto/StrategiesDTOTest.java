package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StrategiesDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(StrategiesDTO.class);
        StrategiesDTO strategiesDTO1 = new StrategiesDTO();
        strategiesDTO1.setId(1L);
        StrategiesDTO strategiesDTO2 = new StrategiesDTO();
        assertThat(strategiesDTO1).isNotEqualTo(strategiesDTO2);
        strategiesDTO2.setId(strategiesDTO1.getId());
        assertThat(strategiesDTO1).isEqualTo(strategiesDTO2);
        strategiesDTO2.setId(2L);
        assertThat(strategiesDTO1).isNotEqualTo(strategiesDTO2);
        strategiesDTO1.setId(null);
        assertThat(strategiesDTO1).isNotEqualTo(strategiesDTO2);
    }
}
