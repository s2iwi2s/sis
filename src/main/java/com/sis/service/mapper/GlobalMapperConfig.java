package com.sis.service.mapper;

import org.mapstruct.MapperConfig;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@MapperConfig(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE // Optional: Ignore unmapped fields
)
public interface GlobalMapperConfig {
    default String mapEmptyToNull(String value) {
        if (value == null || value.equalsIgnoreCase("null") || value.equalsIgnoreCase("undefined")) {
            return "";
        }
        return value.trim().isEmpty() ? "" : value;
    }

    default void updateEmptyToNull(String value, @MappingTarget String target) {
        target = mapEmptyToNull(value);
    }
}
