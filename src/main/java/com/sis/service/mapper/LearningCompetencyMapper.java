package com.sis.service.mapper;

import com.sis.domain.CurriculumMap;
import com.sis.domain.LearningCompetency;
import com.sis.service.dto.CurriculumMapDTO;
import com.sis.service.dto.LearningCompetencyDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link LearningCompetency} and its DTO {@link LearningCompetencyDTO}.
 */
@Mapper(componentModel = "spring")
public interface LearningCompetencyMapper extends EntityMapper<LearningCompetencyDTO, LearningCompetency> {
    @Mapping(target = "curriculumMap", source = "curriculumMap", qualifiedByName = "curriculumMapId")
    LearningCompetencyDTO toDto(LearningCompetency s);

    @Named("curriculumMapId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "quarterNo", source = "quarterNo")
    @Mapping(target = "weekNo", source = "weekNo")
    @Mapping(target = "topic", source = "topic")
    CurriculumMapDTO toDtoCurriculumMapId(CurriculumMap curriculumMap);
}
