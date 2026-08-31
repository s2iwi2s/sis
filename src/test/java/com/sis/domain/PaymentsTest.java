package com.sis.domain;

import static com.sis.domain.AppConfigTestSamples.*;
import static com.sis.domain.InvoicesTestSamples.*;
import static com.sis.domain.PaymentsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaymentsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Payments.class);
        Payments payments1 = getPaymentsSample1();
        Payments payments2 = new Payments();
        assertThat(payments1).isNotEqualTo(payments2);

        payments2.setId(payments1.getId());
        assertThat(payments1).isEqualTo(payments2);

        payments2 = getPaymentsSample2();
        assertThat(payments1).isNotEqualTo(payments2);
    }

    @Test
    void methodTest() {
        Payments payments = getPaymentsRandomSampleGenerator();
        AppConfig appConfigBack = getAppConfigRandomSampleGenerator();

        payments.setMethod(appConfigBack);
        assertThat(payments.getMethod()).isEqualTo(appConfigBack);

        payments.method(null);
        assertThat(payments.getMethod()).isNull();
    }

    @Test
    void invoicesTest() {
        Payments payments = getPaymentsRandomSampleGenerator();
        Invoices invoicesBack = getInvoicesRandomSampleGenerator();

        payments.setInvoices(invoicesBack);
        assertThat(payments.getInvoices()).isEqualTo(invoicesBack);

        payments.invoices(null);
        assertThat(payments.getInvoices()).isNull();
    }
}
