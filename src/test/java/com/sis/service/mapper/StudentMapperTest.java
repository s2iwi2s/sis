package com.sis.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class StudentMapperTest {

    private StudentMapper studentMapper;

    @BeforeEach
    public void setUp() {
        studentMapper = new StudentMapperImpl();
    }
}
