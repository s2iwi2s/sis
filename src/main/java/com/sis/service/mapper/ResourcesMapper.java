package com.sis.service.mapper;

import com.sis.domain.Assessment;
import com.sis.domain.Resources;
import com.sis.domain.Strategies;
import com.sis.service.dto.AssessmentDTO;
import com.sis.service.dto.ResourcesDTO;
import com.sis.service.dto.StrategiesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Resources} and its DTO {@link ResourcesDTO}.
 */
@Mapper(componentModel = "spring")
public interface ResourcesMapper extends EntityMapper<ResourcesDTO, Resources> {
    @Mapping(target = "strategies", source = "strategies", qualifiedByName = "strategiesId")
    @Mapping(target = "assessment", source = "assessment", qualifiedByName = "assessmentId")
    ResourcesDTO toDto(Resources s);

    @Named("strategiesId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StrategiesDTO toDtoStrategiesId(Strategies strategies);

    @Named("assessmentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AssessmentDTO toDtoAssessmentId(Assessment assessment);
}
