package com.sis.repository;

import com.sis.domain.LearningCompetency;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LearningCompetency entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LearningCompetencyRepository extends JpaRepository<LearningCompetency, Long> {
    List<LearningCompetency> findLearningCompetenciesByCurriculumMap_Course_IdOrderBySeqNoAsc(Long id);
}
