package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.User;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AppConfig} and its DTO {@link AppConfigDTO}.
 */
@Mapper(componentModel = "spring")
public interface AppConfigMapper extends EntityMapper<AppConfigDTO, AppConfig> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    AppConfigDTO toDto(AppConfig s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
