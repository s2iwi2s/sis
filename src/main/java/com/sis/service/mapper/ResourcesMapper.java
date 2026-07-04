package com.sis.service.mapper;

import com.sis.domain.Assessment;
import com.sis.domain.Resources;
import com.sis.domain.Strategies;
import com.sis.service.dto.AssessmentDTO;
import com.sis.service.dto.ResourcesDTO;
import com.sis.service.dto.StrategiesDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Resources} and its DTO {@link ResourcesDTO}.
 */
@Mapper(componentModel = "spring")
public interface ResourcesMapper extends EntityMapper<ResourcesDTO, Resources> {
    @Mapping(target = "strategieses", source = "strategieses", qualifiedByName = "strategiesIdSet")
    @Mapping(target = "assessments", source = "assessments", qualifiedByName = "assessmentIdSet")
    ResourcesDTO toDto(Resources s);

    @Mapping(target = "strategieses", ignore = true)
    @Mapping(target = "removeStrategies", ignore = true)
    @Mapping(target = "assessments", ignore = true)
    @Mapping(target = "removeAssessment", ignore = true)
    Resources toEntity(ResourcesDTO resourcesDTO);

    @Named("strategiesId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StrategiesDTO toDtoStrategiesId(Strategies strategies);

    @Named("strategiesIdSet")
    default Set<StrategiesDTO> toDtoStrategiesIdSet(Set<Strategies> strategies) {
        return strategies.stream().map(this::toDtoStrategiesId).collect(Collectors.toSet());
    }

    @Named("assessmentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AssessmentDTO toDtoAssessmentId(Assessment assessment);

    @Named("assessmentIdSet")
    default Set<AssessmentDTO> toDtoAssessmentIdSet(Set<Assessment> assessment) {
        return assessment.stream().map(this::toDtoAssessmentId).collect(Collectors.toSet());
    }
}
