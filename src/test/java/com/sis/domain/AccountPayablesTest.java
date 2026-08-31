package com.sis.domain;

import static com.sis.domain.AccountPayablesTestSamples.*;
import static com.sis.domain.GradeLevelPayablesTestSamples.*;
import static com.sis.domain.InvoicesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountPayablesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountPayables.class);
        AccountPayables accountPayables1 = getAccountPayablesSample1();
        AccountPayables accountPayables2 = new AccountPayables();
        assertThat(accountPayables1).isNotEqualTo(accountPayables2);

        accountPayables2.setId(accountPayables1.getId());
        assertThat(accountPayables1).isEqualTo(accountPayables2);

        accountPayables2 = getAccountPayablesSample2();
        assertThat(accountPayables1).isNotEqualTo(accountPayables2);
    }

    @Test
    void invoicesTest() {
        AccountPayables accountPayables = getAccountPayablesRandomSampleGenerator();
        Invoices invoicesBack = getInvoicesRandomSampleGenerator();

        accountPayables.setInvoices(invoicesBack);
        assertThat(accountPayables.getInvoices()).isEqualTo(invoicesBack);

        accountPayables.invoices(null);
        assertThat(accountPayables.getInvoices()).isNull();
    }

    @Test
    void gradeLevelPayablesTest() {
        AccountPayables accountPayables = getAccountPayablesRandomSampleGenerator();
        GradeLevelPayables gradeLevelPayablesBack = getGradeLevelPayablesRandomSampleGenerator();

        accountPayables.setGradeLevelPayables(gradeLevelPayablesBack);
        assertThat(accountPayables.getGradeLevelPayables()).isEqualTo(gradeLevelPayablesBack);

        accountPayables.gradeLevelPayables(null);
        assertThat(accountPayables.getGradeLevelPayables()).isNull();
    }
}
