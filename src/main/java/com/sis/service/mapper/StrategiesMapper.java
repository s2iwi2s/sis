package com.sis.service.mapper;

import com.sis.domain.LearningCompetency;
import com.sis.domain.Strategies;
import com.sis.service.dto.LearningCompetencyDTO;
import com.sis.service.dto.StrategiesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Strategies} and its DTO {@link StrategiesDTO}.
 */
@Mapper(componentModel = "spring")
public interface StrategiesMapper extends EntityMapper<StrategiesDTO, Strategies> {
    @Mapping(target = "learningCompetency", source = "learningCompetency", qualifiedByName = "learningCompetencyId")
    StrategiesDTO toDto(Strategies s);

    @Named("learningCompetencyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LearningCompetencyDTO toDtoLearningCompetencyId(LearningCompetency learningCompetency);
}
