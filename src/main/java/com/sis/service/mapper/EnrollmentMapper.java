package com.sis.service.mapper;

import com.sis.domain.AcademicTerms;
import com.sis.domain.AcademicYear;
import com.sis.domain.Enrollment;
import com.sis.domain.Student;
import com.sis.service.dto.AcademicTermsDTO;
import com.sis.service.dto.AcademicYearDTO;
import com.sis.service.dto.EnrollmentDTO;
import com.sis.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Enrollment} and its DTO {@link EnrollmentDTO}.
 */
@Mapper(componentModel = "spring")
public interface EnrollmentMapper extends EntityMapper<EnrollmentDTO, Enrollment> {
    @Mapping(target = "year", source = "year", qualifiedByName = "academicYearId")
    @Mapping(target = "terms", source = "terms", qualifiedByName = "academicTermsId")
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    EnrollmentDTO toDto(Enrollment s);

    @Named("academicYearId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicYearDTO toDtoAcademicYearId(AcademicYear academicYear);

    @Named("academicTermsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicTermsDTO toDtoAcademicTermsId(AcademicTerms academicTerms);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}
