package com.sis.service.mapper;

import com.sis.domain.AcademicTerms;
import com.sis.domain.AcademicYear;
import com.sis.domain.CourseSchedule;
import com.sis.domain.Instructor;
import com.sis.domain.Student;
import com.sis.service.dto.AcademicTermsDTO;
import com.sis.service.dto.AcademicYearDTO;
import com.sis.service.dto.CourseScheduleDTO;
import com.sis.service.dto.InstructorDTO;
import com.sis.service.dto.StudentDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CourseSchedule} and its DTO {@link CourseScheduleDTO}.
 */
@Mapper(componentModel = "spring")
public interface CourseScheduleMapper extends EntityMapper<CourseScheduleDTO, CourseSchedule> {
    @Mapping(target = "terms", source = "terms", qualifiedByName = "academicTermsId")
    @Mapping(target = "year", source = "year", qualifiedByName = "academicYearId")
    @Mapping(target = "instructors", source = "instructors", qualifiedByName = "instructorIdSet")
    @Mapping(target = "students", source = "students", qualifiedByName = "studentIdSet")
    CourseScheduleDTO toDto(CourseSchedule s);

    @Mapping(target = "instructors", ignore = true)
    @Mapping(target = "removeInstructor", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "removeStudent", ignore = true)
    CourseSchedule toEntity(CourseScheduleDTO courseScheduleDTO);

    @Named("academicTermsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    AcademicTermsDTO toDtoAcademicTermsId(AcademicTerms academicTerms);

    @Named("academicYearId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    AcademicYearDTO toDtoAcademicYearId(AcademicYear academicYear);

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
