package com.sis.service.mapper;

import com.sis.domain.AppConfig;
import com.sis.domain.CourseSchedule;
import com.sis.domain.Student;
import com.sis.domain.User;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.CourseScheduleDTO;
import com.sis.service.dto.StudentDTO;
import com.sis.service.dto.UserDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Student} and its DTO {@link StudentDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudentMapper extends EntityMapper<StudentDTO, Student> {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "appConfigId")
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    @Mapping(target = "courseSchedules", source = "courseSchedules", qualifiedByName = "courseScheduleIdSet")
    StudentDTO toDto(Student s);

    @Mapping(target = "removeCourseSchedule", ignore = true)
    Student toEntity(StudentDTO studentDTO);

    @Named("appConfigId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppConfigDTO toDtoAppConfigId(AppConfig appConfig);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("courseScheduleId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CourseScheduleDTO toDtoCourseScheduleId(CourseSchedule courseSchedule);

    @Named("courseScheduleIdSet")
    default Set<CourseScheduleDTO> toDtoCourseScheduleIdSet(Set<CourseSchedule> courseSchedule) {
        return courseSchedule.stream().map(this::toDtoCourseScheduleId).collect(Collectors.toSet());
    }
}
