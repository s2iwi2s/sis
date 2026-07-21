package com.sis.repository;

import com.sis.domain.Course;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Course entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByYearCurrent(boolean current);
    List<Course> findByYearCurrentOrderByYearNameAscGradelevelValueAscSubjectAsc(boolean current);
}
