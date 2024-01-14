package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.Course;
import com.sis.domain.Instructor;
import com.sis.domain.Student;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseDTO;
import com.sis.service.dto.InstructorDTO;
import com.sis.service.dto.StudentDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Course} and its DTO {@link CourseDTO}.
 */
@Mapper(componentModel = "spring")
public interface CourseMapper extends EntityMapper<CourseDTO, Course> {
    @Mapping(target = "gradelevel", source = "gradelevel", qualifiedByName = "appConfigId")
    @Mapping(target = "schYr", source = "schYr", qualifiedByName = "appConfigId")
    @Mapping(target = "instructors", source = "instructors", qualifiedByName = "instructorIdSet")
    @Mapping(target = "students", source = "students", qualifiedByName = "studentIdSet")
    CourseDTO toDto(Course s);

    @Mapping(target = "removeInstructor", ignore = true)
    @Mapping(target = "removeStudent", ignore = true)
    Course toEntity(CourseDTO courseDTO);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "description")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("instructorId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InstructorDTO toDtoInstructorId(Instructor instructor);

    @Named("instructorIdSet")
    default Set<InstructorDTO> toDtoInstructorIdSet(Set<Instructor> instructor) {
        return instructor.stream().map(this::toDtoInstructorId).collect(Collectors.toSet());
    }

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);

    @Named("studentIdSet")
    default Set<StudentDTO> toDtoStudentIdSet(Set<Student> student) {
        return student.stream().map(this::toDtoStudentId).collect(Collectors.toSet());
    }
}
