package com.sis.service.mapper;

import com.sis.domain.AcademicTerms;
import com.sis.domain.AcademicYear;
import com.sis.domain.AppConfig;
import com.sis.domain.ClassSchedule;
import com.sis.service.dto.AcademicTermsDTO;
import com.sis.service.dto.AcademicYearDTO;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.ClassScheduleDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ClassSchedule} and its DTO {@link ClassScheduleDTO}.
 */
@Mapper(componentModel = "spring")
public interface ClassScheduleMapper extends EntityMapper<ClassScheduleDTO, ClassSchedule> {
    @Mapping(target = "gradelevel", source = "gradelevel", qualifiedByName = "appConfigId")
    @Mapping(target = "terms", source = "terms", qualifiedByName = "academicTermsId")
    @Mapping(target = "year", source = "year", qualifiedByName = "academicYearId")
    ClassScheduleDTO toDto(ClassSchedule s);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("academicTermsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicTermsDTO toDtoAcademicTermsId(AcademicTerms academicTerms);

    @Named("academicYearId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicYearDTO toDtoAcademicYearId(AcademicYear academicYear);
}
