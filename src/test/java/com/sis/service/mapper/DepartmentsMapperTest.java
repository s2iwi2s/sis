package com.sis.service.mapper;

import static com.sis.domain.DepartmentsAsserts.*;
import static com.sis.domain.DepartmentsTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DepartmentsMapperTest {

    private DepartmentsMapper departmentsMapper;

    @BeforeEach
    void setUp() {
        departmentsMapper = new DepartmentsMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getDepartmentsSample1();
        var actual = departmentsMapper.toEntity(departmentsMapper.toDto(expected));
        assertDepartmentsAllPropertiesEquals(expected, actual);
    }
}
