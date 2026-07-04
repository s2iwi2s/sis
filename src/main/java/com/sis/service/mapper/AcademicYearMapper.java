package com.sis.service.mapper;

import com.sis.domain.AcademicYear;
import com.sis.service.dto.AcademicYearDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AcademicYear} and its DTO {@link AcademicYearDTO}.
 */
@Mapper(componentModel = "spring")
public interface AcademicYearMapper extends EntityMapper<AcademicYearDTO, AcademicYear> {}
