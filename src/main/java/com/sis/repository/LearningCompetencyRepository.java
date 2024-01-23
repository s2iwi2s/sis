package com.sis.repository;

import com.sis.domain.LearningCompetency;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the LearningCompetency entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LearningCompetencyRepository extends JpaRepository<LearningCompetency, Long> {
    List<LearningCompetency> findLearningCompetenciesByCurriculumMap_Course_Id(Long id);
}
