package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrgDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrgDTO.class);
        OrgDTO orgDTO1 = new OrgDTO();
        orgDTO1.setId(1L);
        OrgDTO orgDTO2 = new OrgDTO();
        assertThat(orgDTO1).isNotEqualTo(orgDTO2);
        orgDTO2.setId(orgDTO1.getId());
        assertThat(orgDTO1).isEqualTo(orgDTO2);
        orgDTO2.setId(2L);
        assertThat(orgDTO1).isNotEqualTo(orgDTO2);
        orgDTO1.setId(null);
        assertThat(orgDTO1).isNotEqualTo(orgDTO2);
    }
}
