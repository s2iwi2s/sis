package com.sis.service.mapper;

import com.sis.domain.AccountPayables;
import com.sis.domain.GradeLevelPayables;
import com.sis.domain.Invoices;
import com.sis.service.dto.AccountPayablesDTO;
import com.sis.service.dto.GradeLevelPayablesDTO;
import com.sis.service.dto.InvoicesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AccountPayables} and its DTO {@link AccountPayablesDTO}.
 */
@Mapper(componentModel = "spring")
public interface AccountPayablesMapper extends EntityMapper<AccountPayablesDTO, AccountPayables> {
    @Mapping(target = "invoices", source = "invoices", qualifiedByName = "invoicesId")
    @Mapping(target = "gradeLevelPayables", source = "gradeLevelPayables", qualifiedByName = "gradeLevelPayablesId")
    AccountPayablesDTO toDto(AccountPayables s);

    @Named("invoicesId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InvoicesDTO toDtoInvoicesId(Invoices invoices);

    @Named("gradeLevelPayablesId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GradeLevelPayablesDTO toDtoGradeLevelPayablesId(GradeLevelPayables gradeLevelPayables);
}
