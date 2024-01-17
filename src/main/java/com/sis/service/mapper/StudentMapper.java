package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Course;
import com.sis.domain.Student;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseDTO;
import com.sis.service.dto.StudentDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Student} and its DTO {@link StudentDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudentMapper extends EntityMapper<StudentDTO, Student> {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "appConfigId")
    @Mapping(target = "courses", source = "courses", qualifiedByName = "courseIdSet")
    StudentDTO toDto(Student s);

    @Mapping(target = "removeCourse", ignore = true)
    Student toEntity(StudentDTO studentDTO);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "description")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "subject", source = "subject")
    CourseDTO toDtoCourseId(Course course);

    @Named("courseIdSet")
    default Set<CourseDTO> toDtoCourseIdSet(Set<Course> course) {
        return course.stream().map(this::toDtoCourseId).collect(Collectors.toSet());
    }
}
