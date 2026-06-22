package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Course;
import com.sis.domain.Instructor;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseDTO;
import com.sis.service.dto.InstructorDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Instructor} and its DTO {@link InstructorDTO}.
 */
@Mapper(componentModel = "spring")
public interface InstructorMapper extends EntityMapper<InstructorDTO, Instructor> {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "appConfigId")
    @Mapping(target = "courses", source = "courses", qualifiedByName = "courseIdSet")
    InstructorDTO toDto(Instructor s);

    @Mapping(target = "removeCourse", ignore = true)
    Instructor toEntity(InstructorDTO instructorDTO);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "description")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CourseDTO toDtoCourseId(Course course);

    @Named("courseIdSet")
    default Set<CourseDTO> toDtoCourseIdSet(Set<Course> course) {
        return course.stream().map(this::toDtoCourseId).collect(Collectors.toSet());
    }
}
