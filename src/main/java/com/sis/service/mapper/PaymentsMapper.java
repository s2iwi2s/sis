package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Invoices;
import com.sis.domain.Payments;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.InvoicesDTO;
import com.sis.service.dto.PaymentsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Payments} and its DTO {@link PaymentsDTO}.
 */
@Mapper(componentModel = "spring")
public interface PaymentsMapper extends EntityMapper<PaymentsDTO, Payments> {
    @Mapping(target = "method", source = "method", qualifiedByName = "appConfigId")
    @Mapping(target = "invoices", source = "invoices", qualifiedByName = "invoicesId")
    PaymentsDTO toDto(Payments s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("invoicesId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InvoicesDTO toDtoInvoicesId(Invoices invoices);
}
