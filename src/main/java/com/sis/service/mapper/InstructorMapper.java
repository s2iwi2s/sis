package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.CourseSchedule;
import com.sis.domain.Instructor;
import com.sis.domain.User;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseScheduleDTO;
import com.sis.service.dto.InstructorDTO;
import com.sis.service.dto.UserDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Instructor} and its DTO {@link InstructorDTO}.
 */
@Mapper(componentModel = "spring")
public interface InstructorMapper extends EntityMapper<InstructorDTO, Instructor> {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "appConfigId")
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    @Mapping(target = "courseSchedules", source = "courseSchedules", qualifiedByName = "courseScheduleIdSet")
    InstructorDTO toDto(Instructor s);

    @Mapping(target = "removeCourseSchedule", ignore = true)
    Instructor toEntity(InstructorDTO instructorDTO);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "value", source = "value")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("courseScheduleId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "room", source = "room")
    @Mapping(target = "description", source = "description")
    CourseScheduleDTO toDtoCourseScheduleId(CourseSchedule courseSchedule);

    @Named("courseScheduleIdSet")
    default Set<CourseScheduleDTO> toDtoCourseScheduleIdSet(Set<CourseSchedule> courseSchedule) {
        return courseSchedule.stream().map(this::toDtoCourseScheduleId).collect(Collectors.toSet());
    }
}
