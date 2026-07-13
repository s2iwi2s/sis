package com.sis.repository;

import com.sis.domain.Resources;
import com.sis.domain.Strategies;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Spring Data JPA repository for the Strategies entity.
 *
 * When extending this class, extend StrategiesRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface StrategiesRepository extends StrategiesRepositoryWithBagRelationships, JpaRepository<Strategies, Long> {
    default Optional<Strategies> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Strategies> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Strategies> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    Optional<Strategies> findByResources(Resources resources);

    @Query(
        "select s from Strategies s " +
            "join  LearningCompetency l on l.id = s.learningCompetency.id " +
            "join CurriculumMap c on c.id = l.curriculumMap.id " +
            "where c.course.id=:courseId"
    )
    List<Strategies> findAllByCourseId(@PathVariable("courseId") Long courseId);
}
