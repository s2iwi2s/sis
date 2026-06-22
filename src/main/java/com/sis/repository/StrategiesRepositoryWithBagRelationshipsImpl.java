package com.sis.repository;

import com.sis.domain.Strategies;
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
public class StrategiesRepositoryWithBagRelationshipsImpl implements StrategiesRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Strategies> fetchBagRelationships(Optional<Strategies> strategies) {
        return strategies.map(this::fetchResources);
    }

    @Override
    public Page<Strategies> fetchBagRelationships(Page<Strategies> strategies) {
        return new PageImpl<>(fetchBagRelationships(strategies.getContent()), strategies.getPageable(), strategies.getTotalElements());
    }

    @Override
    public List<Strategies> fetchBagRelationships(List<Strategies> strategies) {
        return Optional.of(strategies).map(this::fetchResources).orElse(Collections.emptyList());
    }

    Strategies fetchResources(Strategies result) {
        return entityManager
            .createQuery(
                "select strategies from Strategies strategies left join fetch strategies.resources where strategies.id = :id",
                Strategies.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Strategies> fetchResources(List<Strategies> strategies) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, strategies.size()).forEach(index -> order.put(strategies.get(index).getId(), index));
        List<Strategies> result = entityManager
            .createQuery(
                "select strategies from Strategies strategies left join fetch strategies.resources where strategies in :strategies",
                Strategies.class
            )
            .setParameter("strategies", strategies)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
