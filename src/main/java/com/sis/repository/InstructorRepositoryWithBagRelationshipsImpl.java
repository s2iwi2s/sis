package com.sis.repository;

import com.sis.domain.Instructor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class InstructorRepositoryWithBagRelationshipsImpl implements InstructorRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Instructor> fetchBagRelationships(Optional<Instructor> instructor) {
        return instructor.map(this::fetchCourses);
    }

    @Override
    public Page<Instructor> fetchBagRelationships(Page<Instructor> instructors) {
        return new PageImpl<>(fetchBagRelationships(instructors.getContent()), instructors.getPageable(), instructors.getTotalElements());
    }

    @Override
    public List<Instructor> fetchBagRelationships(List<Instructor> instructors) {
        return Optional.of(instructors).map(this::fetchCourses).orElse(Collections.emptyList());
    }

    Instructor fetchCourses(Instructor result) {
        return entityManager
            .createQuery(
                "select instructor from Instructor instructor left join fetch instructor.courses where instructor.id = :id",
                Instructor.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Instructor> fetchCourses(List<Instructor> instructors) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, instructors.size()).forEach(index -> order.put(instructors.get(index).getId(), index));
        List<Instructor> result = entityManager
            .createQuery(
                "select instructor from Instructor instructor left join fetch instructor.courses where instructor in :instructors",
                Instructor.class
            )
            .setParameter("instructors", instructors)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
