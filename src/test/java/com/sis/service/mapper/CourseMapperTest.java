package com.sis.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class CourseMapperTest {

    private CourseMapper courseMapper;

    @BeforeEach
    public void setUp() {
        courseMapper = new CourseMapperImpl();
    }
}
