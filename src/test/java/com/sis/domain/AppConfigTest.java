package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.CourseTestSamples.*;
import static com.sis.domain.InstructorTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppConfigTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppConfig.class);
        AppConfig appConfig1 = getAppConfigSample1();
        AppConfig appConfig2 = new AppConfig();
        assertThat(appConfig1).isNotEqualTo(appConfig2);

        appConfig2.setId(appConfig1.getId());
        assertThat(appConfig1).isEqualTo(appConfig2);

        appConfig2 = getAppConfigSample2();
        assertThat(appConfig1).isNotEqualTo(appConfig2);
    }
}
