package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Course;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Course} and its DTO {@link CourseDTO}.
 */
@Mapper(componentModel = "spring")
public interface CourseMapper extends EntityMapper<CourseDTO, Course> {
    @Mapping(target = "gradelevel", source = "gradelevel", qualifiedByName = "appConfigId")
    @Mapping(target = "schYr", source = "schYr", qualifiedByName = "appConfigId")
    //@Mapping(target = "instructors", source = "instructors", qualifiedByName = "instructorIdSet")
    //@Mapping(target = "students", source = "students", qualifiedByName = "studentIdSet")
    CourseDTO toDto(Course s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "description")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);
}
