package com.sis.service.mapper;

import com.sis.domain.Departments;
import com.sis.service.dto.DepartmentsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Departments} and its DTO {@link DepartmentsDTO}.
 */
@Mapper(componentModel = "spring")
public interface DepartmentsMapper extends EntityMapper<DepartmentsDTO, Departments> {}
