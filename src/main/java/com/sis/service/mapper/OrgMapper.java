package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Org;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.OrgDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Org} and its DTO {@link OrgDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrgMapper extends EntityMapper<OrgDTO, Org> {
    @Mapping(target = "currSchYr", source = "currSchYr", qualifiedByName = "appConfigId")
    OrgDTO toDto(Org s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);
}
