package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Student;
import com.sis.domain.User;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.StudentDTO;
import com.sis.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Student} and its DTO {@link StudentDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudentMapper extends EntityMapper<StudentDTO, Student> {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "appConfigId")
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    StudentDTO toDto(Student s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
