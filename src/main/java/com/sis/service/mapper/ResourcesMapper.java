package com.sis.service.mapper;

import com.sis.domain.Resources;
import com.sis.service.dto.ResourcesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Resources} and its DTO {@link ResourcesDTO}.
 */
@Mapper(componentModel = "spring")
public interface ResourcesMapper extends EntityMapper<ResourcesDTO, Resources> {}
