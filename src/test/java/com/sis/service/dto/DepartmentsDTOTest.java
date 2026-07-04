package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DepartmentsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DepartmentsDTO.class);
        DepartmentsDTO departmentsDTO1 = new DepartmentsDTO();
        departmentsDTO1.setId(1L);
        DepartmentsDTO departmentsDTO2 = new DepartmentsDTO();
        assertThat(departmentsDTO1).isNotEqualTo(departmentsDTO2);
        departmentsDTO2.setId(departmentsDTO1.getId());
        assertThat(departmentsDTO1).isEqualTo(departmentsDTO2);
        departmentsDTO2.setId(2L);
        assertThat(departmentsDTO1).isNotEqualTo(departmentsDTO2);
        departmentsDTO1.setId(null);
        assertThat(departmentsDTO1).isNotEqualTo(departmentsDTO2);
    }
}
