package com.sis.domain;

import static com.sis.domain.AccountPayablesTestSamples.*;
import static com.sis.domain.InvoicesTestSamples.*;
import static com.sis.domain.PaymentsTestSamples.*;
import static com.sis.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class InvoicesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Invoices.class);
        Invoices invoices1 = getInvoicesSample1();
        Invoices invoices2 = new Invoices();
        assertThat(invoices1).isNotEqualTo(invoices2);

        invoices2.setId(invoices1.getId());
        assertThat(invoices1).isEqualTo(invoices2);

        invoices2 = getInvoicesSample2();
        assertThat(invoices1).isNotEqualTo(invoices2);
    }

    @Test
    void accountPayablesTest() {
        Invoices invoices = getInvoicesRandomSampleGenerator();
        AccountPayables accountPayablesBack = getAccountPayablesRandomSampleGenerator();

        invoices.addAccountPayables(accountPayablesBack);
        assertThat(invoices.getAccountPayableses()).containsOnly(accountPayablesBack);
        assertThat(accountPayablesBack.getInvoices()).isEqualTo(invoices);

        invoices.removeAccountPayables(accountPayablesBack);
        assertThat(invoices.getAccountPayableses()).doesNotContain(accountPayablesBack);
        assertThat(accountPayablesBack.getInvoices()).isNull();

        invoices.accountPayableses(new HashSet<>(Set.of(accountPayablesBack)));
        assertThat(invoices.getAccountPayableses()).containsOnly(accountPayablesBack);
        assertThat(accountPayablesBack.getInvoices()).isEqualTo(invoices);

        invoices.setAccountPayableses(new HashSet<>());
        assertThat(invoices.getAccountPayableses()).doesNotContain(accountPayablesBack);
        assertThat(accountPayablesBack.getInvoices()).isNull();
    }

    @Test
    void paymentsTest() {
        Invoices invoices = getInvoicesRandomSampleGenerator();
        Payments paymentsBack = getPaymentsRandomSampleGenerator();

        invoices.addPayments(paymentsBack);
        assertThat(invoices.getPaymentses()).containsOnly(paymentsBack);
        assertThat(paymentsBack.getInvoices()).isEqualTo(invoices);

        invoices.removePayments(paymentsBack);
        assertThat(invoices.getPaymentses()).doesNotContain(paymentsBack);
        assertThat(paymentsBack.getInvoices()).isNull();

        invoices.paymentses(new HashSet<>(Set.of(paymentsBack)));
        assertThat(invoices.getPaymentses()).containsOnly(paymentsBack);
        assertThat(paymentsBack.getInvoices()).isEqualTo(invoices);

        invoices.setPaymentses(new HashSet<>());
        assertThat(invoices.getPaymentses()).doesNotContain(paymentsBack);
        assertThat(paymentsBack.getInvoices()).isNull();
    }

    @Test
    void studentTest() {
        Invoices invoices = getInvoicesRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        invoices.setStudent(studentBack);
        assertThat(invoices.getStudent()).isEqualTo(studentBack);

        invoices.student(null);
        assertThat(invoices.getStudent()).isNull();
    }
}
