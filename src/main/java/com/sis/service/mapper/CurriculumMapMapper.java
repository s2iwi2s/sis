package com.sis.service.mapper;

import com.sis.domain.Course;
import com.sis.domain.CurriculumMap;
import com.sis.service.dto.CourseDTO;
import com.sis.service.dto.CurriculumMapDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CurriculumMap} and its DTO {@link CurriculumMapDTO}.
 */
@Mapper(componentModel = "spring")
public interface CurriculumMapMapper extends EntityMapper<CurriculumMapDTO, CurriculumMap> {
    @Mapping(target = "course", source = "course", qualifiedByName = "courseId")
    CurriculumMapDTO toDto(CurriculumMap s);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "courseDescription", source = "courseDescription")
    CourseDTO toDtoCourseId(Course course);
}
