package com.sis.service.mapper;

import java.util.List;
import org.mapstruct.*;

/**
 * Contract for a generic dto to entity mapper.
 *
 * @param <D> - DTO type parameter.
 * @param <E> - Entity type parameter.
 */
public interface EntityMapper<D, E> {
    E toEntity(D dto);

    D toDto(E entity);

    List<E> toEntity(List<D> dtoList);

    List<D> toDto(List<E> entityList);

    @Named("partialUpdate")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget E entity, D dto);

    default String emptyToNull(String value) {
        if (value == null || (value != null && value.equalsIgnoreCase("null"))) return null;
        return value.trim().isEmpty() ? null : value;
    }
}
