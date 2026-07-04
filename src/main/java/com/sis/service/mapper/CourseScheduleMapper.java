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
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CourseSchedule} and its DTO {@link CourseScheduleDTO}.
 */
@Mapper(componentModel = "spring")
public interface CourseScheduleMapper extends EntityMapper<CourseScheduleDTO, CourseSchedule> {
    @Mapping(target = "terms", source = "terms", qualifiedByName = "academicTermsId")
    @Mapping(target = "year", source = "year", qualifiedByName = "academicYearId")
    @Mapping(target = "instructor", source = "instructor", qualifiedByName = "instructorId")
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    CourseScheduleDTO toDto(CourseSchedule s);

    @Named("academicTermsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicTermsDTO toDtoAcademicTermsId(AcademicTerms academicTerms);

    @Named("academicYearId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicYearDTO toDtoAcademicYearId(AcademicYear academicYear);

    @Named("instructorId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InstructorDTO toDtoInstructorId(Instructor instructor);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}
