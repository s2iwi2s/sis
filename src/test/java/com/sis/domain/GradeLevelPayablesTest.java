package com.sis.domain;

import static com.sis.domain.AccountPayablesTestSamples.*;
import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.GradeLevelPayablesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GradeLevelPayablesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GradeLevelPayables.class);
        GradeLevelPayables gradeLevelPayables1 = getGradeLevelPayablesSample1();
        GradeLevelPayables gradeLevelPayables2 = new GradeLevelPayables();
        assertThat(gradeLevelPayables1).isNotEqualTo(gradeLevelPayables2);

        gradeLevelPayables2.setId(gradeLevelPayables1.getId());
        assertThat(gradeLevelPayables1).isEqualTo(gradeLevelPayables2);

        gradeLevelPayables2 = getGradeLevelPayablesSample2();
        assertThat(gradeLevelPayables1).isNotEqualTo(gradeLevelPayables2);
    }

    @Test
    void gradelevelTest() {
        GradeLevelPayables gradeLevelPayables = getGradeLevelPayablesRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        gradeLevelPayables.setGradelevel(appConfigBack);
        assertThat(gradeLevelPayables.getGradelevel()).isEqualTo(appConfigBack);

        gradeLevelPayables.gradelevel(null);
        assertThat(gradeLevelPayables.getGradelevel()).isNull();
    }

    @Test
    void accountPayablesTest() {
        GradeLevelPayables gradeLevelPayables = getGradeLevelPayablesRandomSampleGenerator();
        AccountPayables accountPayablesBack = getAccountPayablesRandomSampleGenerator();

        gradeLevelPayables.addAccountPayables(accountPayablesBack);
        assertThat(gradeLevelPayables.getAccountPayableses()).containsOnly(accountPayablesBack);
        assertThat(accountPayablesBack.getGradeLevelPayables()).isEqualTo(gradeLevelPayables);

        gradeLevelPayables.removeAccountPayables(accountPayablesBack);
        assertThat(gradeLevelPayables.getAccountPayableses()).doesNotContain(accountPayablesBack);
        assertThat(accountPayablesBack.getGradeLevelPayables()).isNull();

        gradeLevelPayables.accountPayableses(new HashSet<>(Set.of(accountPayablesBack)));
        assertThat(gradeLevelPayables.getAccountPayableses()).containsOnly(accountPayablesBack);
        assertThat(accountPayablesBack.getGradeLevelPayables()).isEqualTo(gradeLevelPayables);

        gradeLevelPayables.setAccountPayableses(new HashSet<>());
        assertThat(gradeLevelPayables.getAccountPayableses()).doesNotContain(accountPayablesBack);
        assertThat(accountPayablesBack.getGradeLevelPayables()).isNull();
    }
}
