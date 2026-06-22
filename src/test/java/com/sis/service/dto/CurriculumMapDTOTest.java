package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CurriculumMapDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CurriculumMapDTO.class);
        CurriculumMapDTO curriculumMapDTO1 = new CurriculumMapDTO();
        curriculumMapDTO1.setId(1L);
        CurriculumMapDTO curriculumMapDTO2 = new CurriculumMapDTO();
        assertThat(curriculumMapDTO1).isNotEqualTo(curriculumMapDTO2);
        curriculumMapDTO2.setId(curriculumMapDTO1.getId());
        assertThat(curriculumMapDTO1).isEqualTo(curriculumMapDTO2);
        curriculumMapDTO2.setId(2L);
        assertThat(curriculumMapDTO1).isNotEqualTo(curriculumMapDTO2);
        curriculumMapDTO1.setId(null);
        assertThat(curriculumMapDTO1).isNotEqualTo(curriculumMapDTO2);
    }
}
