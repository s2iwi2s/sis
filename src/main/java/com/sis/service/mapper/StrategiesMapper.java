package com.sis.service.mapper;

import com.sis.domain.LearningCompetency;
import com.sis.domain.Resources;
import com.sis.domain.Strategies;
import com.sis.service.dto.LearningCompetencyDTO;
import com.sis.service.dto.ResourcesDTO;
import com.sis.service.dto.StrategiesDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Strategies} and its DTO {@link StrategiesDTO}.
 */
@Mapper(componentModel = "spring")
public interface StrategiesMapper extends EntityMapper<StrategiesDTO, Strategies> {
    @Mapping(target = "resources", source = "resources", qualifiedByName = "resourcesIdSet")
    @Mapping(target = "learningCompetency", source = "learningCompetency", qualifiedByName = "learningCompetencyId")
    StrategiesDTO toDto(Strategies s);

    @Mapping(target = "removeResources", ignore = true)
    Strategies toEntity(StrategiesDTO strategiesDTO);

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
    @Mapping(target = "seqNo", source = "seqNo")
    @Mapping(target = "competencyCode", source = "competencyCode")
    LearningCompetencyDTO toDtoLearningCompetencyId(LearningCompetency learningCompetency);
}
