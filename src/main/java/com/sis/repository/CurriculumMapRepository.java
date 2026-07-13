package com.sis.repository;

import com.sis.domain.Course;
import com.sis.domain.CurriculumMap;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CurriculumMap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CurriculumMapRepository extends JpaRepository<CurriculumMap, Long> {
    List<CurriculumMap> findByCourseOrderByQuarterNoAscWeekNoAsc(Course course);
}
