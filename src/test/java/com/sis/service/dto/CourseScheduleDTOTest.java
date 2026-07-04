package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CourseScheduleDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CourseScheduleDTO.class);
        CourseScheduleDTO courseScheduleDTO1 = new CourseScheduleDTO();
        courseScheduleDTO1.setId(1L);
        CourseScheduleDTO courseScheduleDTO2 = new CourseScheduleDTO();
        assertThat(courseScheduleDTO1).isNotEqualTo(courseScheduleDTO2);
        courseScheduleDTO2.setId(courseScheduleDTO1.getId());
        assertThat(courseScheduleDTO1).isEqualTo(courseScheduleDTO2);
        courseScheduleDTO2.setId(2L);
        assertThat(courseScheduleDTO1).isNotEqualTo(courseScheduleDTO2);
        courseScheduleDTO1.setId(null);
        assertThat(courseScheduleDTO1).isNotEqualTo(courseScheduleDTO2);
    }
}
