package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LearningCompetencyDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LearningCompetencyDTO.class);
        LearningCompetencyDTO learningCompetencyDTO1 = new LearningCompetencyDTO();
        learningCompetencyDTO1.setId(1L);
        LearningCompetencyDTO learningCompetencyDTO2 = new LearningCompetencyDTO();
        assertThat(learningCompetencyDTO1).isNotEqualTo(learningCompetencyDTO2);
        learningCompetencyDTO2.setId(learningCompetencyDTO1.getId());
        assertThat(learningCompetencyDTO1).isEqualTo(learningCompetencyDTO2);
        learningCompetencyDTO2.setId(2L);
        assertThat(learningCompetencyDTO1).isNotEqualTo(learningCompetencyDTO2);
        learningCompetencyDTO1.setId(null);
        assertThat(learningCompetencyDTO1).isNotEqualTo(learningCompetencyDTO2);
    }
}
