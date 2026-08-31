package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaymentsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentsDTO.class);
        PaymentsDTO paymentsDTO1 = new PaymentsDTO();
        paymentsDTO1.setId(1L);
        PaymentsDTO paymentsDTO2 = new PaymentsDTO();
        assertThat(paymentsDTO1).isNotEqualTo(paymentsDTO2);
        paymentsDTO2.setId(paymentsDTO1.getId());
        assertThat(paymentsDTO1).isEqualTo(paymentsDTO2);
        paymentsDTO2.setId(2L);
        assertThat(paymentsDTO1).isNotEqualTo(paymentsDTO2);
        paymentsDTO1.setId(null);
        assertThat(paymentsDTO1).isNotEqualTo(paymentsDTO2);
    }
}
