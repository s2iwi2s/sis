package com.sis.service.mapper;

import static com.sis.domain.CourseScheduleAsserts.*;
import static com.sis.domain.CourseScheduleTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CourseScheduleMapperTest {

    private CourseScheduleMapper courseScheduleMapper;

    @BeforeEach
    void setUp() {
        courseScheduleMapper = new CourseScheduleMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCourseScheduleSample1();
        var actual = courseScheduleMapper.toEntity(courseScheduleMapper.toDto(expected));
        assertCourseScheduleAllPropertiesEquals(expected, actual);
    }
}
