package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Student;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Student} and its DTO {@link StudentDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudentMapper extends EntityMapper<StudentDTO, Student> {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "appConfigId")
    StudentDTO toDto(Student s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "description")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);
}
