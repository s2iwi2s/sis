package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.GradeLevelPayables;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.GradeLevelPayablesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GradeLevelPayables} and its DTO {@link GradeLevelPayablesDTO}.
 */
@Mapper(componentModel = "spring")
public interface GradeLevelPayablesMapper extends EntityMapper<GradeLevelPayablesDTO, GradeLevelPayables> {
    @Mapping(target = "gradelevel", source = "gradelevel", qualifiedByName = "appConfigId")
    GradeLevelPayablesDTO toDto(GradeLevelPayables s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);
}
