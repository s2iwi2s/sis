package com.sis.repository;

import com.sis.domain.Assessment;
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
public class AssessmentRepositoryWithBagRelationshipsImpl implements AssessmentRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Assessment> fetchBagRelationships(Optional<Assessment> assessment) {
        return assessment.map(this::fetchResources);
    }

    @Override
    public Page<Assessment> fetchBagRelationships(Page<Assessment> assessments) {
        return new PageImpl<>(fetchBagRelationships(assessments.getContent()), assessments.getPageable(), assessments.getTotalElements());
    }

    @Override
    public List<Assessment> fetchBagRelationships(List<Assessment> assessments) {
        return Optional.of(assessments).map(this::fetchResources).orElse(Collections.emptyList());
    }

    Assessment fetchResources(Assessment result) {
        return entityManager
            .createQuery(
                "select assessment from Assessment assessment left join fetch assessment.resources where assessment.id = :id",
                Assessment.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Assessment> fetchResources(List<Assessment> assessments) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, assessments.size()).forEach(index -> order.put(assessments.get(index).getId(), index));
        List<Assessment> result = entityManager
            .createQuery(
                "select assessment from Assessment assessment left join fetch assessment.resources where assessment in :assessments",
                Assessment.class
            )
            .setParameter("assessments", assessments)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
