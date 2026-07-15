package com.sis.service.mapper;

import com.sis.domain.AcademicYear;
import com.sis.domain.AppConfig;
import com.sis.domain.Course;
import com.sis.domain.CurriculumMap;
import com.sis.service.dto.AcademicYearDTO;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseDTO;
import com.sis.service.dto.CurriculumMapDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CurriculumMap} and its DTO {@link CurriculumMapDTO}.
 */
@Mapper(componentModel = "spring")
public interface CurriculumMapMapper extends EntityMapper<CurriculumMapDTO, CurriculumMap> {
    @Mapping(target = "course", source = "course", qualifiedByName = "courseId")
    CurriculumMapDTO toDto(CurriculumMap s);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "subject", source = "subject")
    @Mapping(target = "courseDescription", source = "courseDescription")
    @Mapping(target = "gradelevel", source = "gradelevel", qualifiedByName = "appConfigId")
    @Mapping(target = "year", source = "year", qualifiedByName = "academicYearId")
    CourseDTO toDtoCourseId(Course course);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "value", source = "value")
    @Mapping(target = "description", source = "description")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("academicYearId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    AcademicYearDTO toDtoAcademicYearId(AcademicYear academicYear);
}
