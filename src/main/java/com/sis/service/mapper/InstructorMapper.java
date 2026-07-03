package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Instructor;
import com.sis.domain.User;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.InstructorDTO;
import com.sis.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Instructor} and its DTO {@link InstructorDTO}.
 */
@Mapper(componentModel = "spring")
public interface InstructorMapper extends EntityMapper<InstructorDTO, Instructor> {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "appConfigId")
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    InstructorDTO toDto(Instructor s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
