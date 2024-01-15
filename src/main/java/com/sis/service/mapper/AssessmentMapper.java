package com.sis.service.mapper;

import com.sis.domain.Assessment;
import com.sis.domain.LearningCompetency;
import com.sis.service.dto.AssessmentDTO;
import com.sis.service.dto.LearningCompetencyDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Assessment} and its DTO {@link AssessmentDTO}.
 */
@Mapper(componentModel = "spring")
public interface AssessmentMapper extends EntityMapper<AssessmentDTO, Assessment> {
    @Mapping(target = "learningCompetency", source = "learningCompetency", qualifiedByName = "learningCompetencyId")
    AssessmentDTO toDto(Assessment s);

    @Named("learningCompetencyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "competencyCode", source = "competencyCode")
    @Mapping(target = "description", source = "description")
    LearningCompetencyDTO toDtoLearningCompetencyId(LearningCompetency learningCompetency);
}
