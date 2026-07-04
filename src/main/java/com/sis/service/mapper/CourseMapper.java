package com.sis.service.mapper;

import com.sis.domain.AcademicTerms;
import com.sis.domain.AcademicYear;
import com.sis.domain.AppConfig;
import com.sis.domain.Course;
import com.sis.domain.Departments;
import com.sis.service.dto.AcademicTermsDTO;
import com.sis.service.dto.AcademicYearDTO;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseDTO;
import com.sis.service.dto.DepartmentsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Course} and its DTO {@link CourseDTO}.
 */
@Mapper(componentModel = "spring")
public interface CourseMapper extends EntityMapper<CourseDTO, Course> {
    @Mapping(target = "gradelevel", source = "gradelevel", qualifiedByName = "appConfigId")
    @Mapping(target = "department", source = "department", qualifiedByName = "departmentsId")
    @Mapping(target = "year", source = "year", qualifiedByName = "academicYearId")
    @Mapping(target = "terms", source = "terms", qualifiedByName = "academicTermsId")
    CourseDTO toDto(Course s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("departmentsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DepartmentsDTO toDtoDepartmentsId(Departments departments);

    @Named("academicYearId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicYearDTO toDtoAcademicYearId(AcademicYear academicYear);

    @Named("academicTermsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicTermsDTO toDtoAcademicTermsId(AcademicTerms academicTerms);
}
