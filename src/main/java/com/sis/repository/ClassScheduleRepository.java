package com.sis.repository;

import com.sis.domain.ClassSchedule;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ClassSchedule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {}
