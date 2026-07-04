package com.sis.service.mapper;

import com.sis.domain.AcademicTerms;
import com.sis.domain.AcademicYear;
import com.sis.service.dto.AcademicTermsDTO;
import com.sis.service.dto.AcademicYearDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AcademicTerms} and its DTO {@link AcademicTermsDTO}.
 */
@Mapper(componentModel = "spring")
public interface AcademicTermsMapper extends EntityMapper<AcademicTermsDTO, AcademicTerms> {
    @Mapping(target = "year", source = "year", qualifiedByName = "academicYearId")
    AcademicTermsDTO toDto(AcademicTerms s);

    @Named("academicYearId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AcademicYearDTO toDtoAcademicYearId(AcademicYear academicYear);
}
