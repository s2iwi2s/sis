package com.sis.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class AppConfigMapperTest {

    private AppConfigMapper appConfigMapper;

    @BeforeEach
    public void setUp() {
        appConfigMapper = new AppConfigMapperImpl();
    }
}
