package com.sis.service.mapper;

import com.sis.domain.Assessment;
import com.sis.domain.LearningCompetency;
import com.sis.domain.Resources;
import com.sis.service.dto.AssessmentDTO;
import com.sis.service.dto.LearningCompetencyDTO;
import com.sis.service.dto.ResourcesDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Assessment} and its DTO {@link AssessmentDTO}.
 */
@Mapper(componentModel = "spring")
public interface AssessmentMapper extends EntityMapper<AssessmentDTO, Assessment> {
    @Mapping(target = "resources", source = "resources", qualifiedByName = "resourcesIdSet")
    @Mapping(target = "learningCompetency", source = "learningCompetency", qualifiedByName = "learningCompetencyId")
    AssessmentDTO toDto(Assessment s);

    @Mapping(target = "removeResources", ignore = true)
    Assessment toEntity(AssessmentDTO assessmentDTO);

    @Named("resourcesId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ResourcesDTO toDtoResourcesId(Resources resources);

    @Named("resourcesIdSet")
    default Set<ResourcesDTO> toDtoResourcesIdSet(Set<Resources> resources) {
        return resources.stream().map(this::toDtoResourcesId).collect(Collectors.toSet());
    }

    @Named("learningCompetencyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "competencyCode", source = "competencyCode")
    @Mapping(target = "description", source = "description")
    LearningCompetencyDTO toDtoLearningCompetencyId(LearningCompetency learningCompetency);
}
