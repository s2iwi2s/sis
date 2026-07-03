package com.sis.repository;

import com.sis.domain.CurriculumMap;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CurriculumMap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CurriculumMapRepository extends JpaRepository<CurriculumMap, Long> {}
