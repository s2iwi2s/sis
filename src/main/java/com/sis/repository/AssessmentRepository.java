package com.sis.repository;

import com.sis.domain.Assessment;
import com.sis.domain.Resources;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Assessment entity.
 *
 * When extending this class, extend AssessmentRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface AssessmentRepository extends AssessmentRepositoryWithBagRelationships, JpaRepository<Assessment, Long> {
    default Optional<Assessment> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Assessment> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Assessment> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
    Optional<Assessment> findByResources(Resources resources);

    @Query("select a from Assessment a " +
        "join  LearningCompetency l on l.id = a.learningCompetency.id " +
        "join CurriculumMap c on c.id = l.curriculumMap.id " +
        "where c.course.id=:courseId")
    List<Assessment> findAllByCourseId(@PathVariable("courseId") Long courseId);
}
