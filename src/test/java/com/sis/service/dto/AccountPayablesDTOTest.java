package com.sis.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountPayablesDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountPayablesDTO.class);
        AccountPayablesDTO accountPayablesDTO1 = new AccountPayablesDTO();
        accountPayablesDTO1.setId(1L);
        AccountPayablesDTO accountPayablesDTO2 = new AccountPayablesDTO();
        assertThat(accountPayablesDTO1).isNotEqualTo(accountPayablesDTO2);
        accountPayablesDTO2.setId(accountPayablesDTO1.getId());
        assertThat(accountPayablesDTO1).isEqualTo(accountPayablesDTO2);
        accountPayablesDTO2.setId(2L);
        assertThat(accountPayablesDTO1).isNotEqualTo(accountPayablesDTO2);
        accountPayablesDTO1.setId(null);
        assertThat(accountPayablesDTO1).isNotEqualTo(accountPayablesDTO2);
    }
}
