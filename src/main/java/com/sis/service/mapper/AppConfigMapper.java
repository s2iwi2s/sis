package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.service.dto.AppConfigDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AppConfig} and its DTO {@link AppConfigDTO}.
 */
@Mapper(componentModel = "spring")
public interface AppConfigMapper extends EntityMapper<AppConfigDTO, AppConfig> {}
