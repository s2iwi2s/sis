package com.sis.repository;

import com.sis.domain.CourseSchedule;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CourseSchedule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Long> {}
