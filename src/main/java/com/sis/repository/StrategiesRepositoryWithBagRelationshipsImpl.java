package com.sis.repository;

import com.sis.domain.Strategies;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

    private static final String ID_PARAMETER = "id";
    private static final String STRATEGIESES_PARAMETER = "strategieses";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Strategies> fetchBagRelationships(Optional<Strategies> strategies) {
        return strategies.map(this::fetchResourceses);
    }

    @Override
    public Page<Strategies> fetchBagRelationships(Page<Strategies> strategieses) {
        return new PageImpl<>(
            fetchBagRelationships(strategieses.getContent()),
            strategieses.getPageable(),
            strategieses.getTotalElements()
        );
    }

    @Override
    public List<Strategies> fetchBagRelationships(List<Strategies> strategieses) {
        return Optional.of(strategieses).map(this::fetchResourceses).orElse(List.of());
    }

    Strategies fetchResourceses(Strategies result) {
        return entityManager
            .createQuery(
                "select strategies from Strategies strategies left join fetch strategies.resourceses where strategies.id = :id",
                Strategies.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Strategies> fetchResourceses(List<Strategies> strategieses) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, strategieses.size()).forEach(index -> order.put(strategieses.get(index).getId(), index));
        List<Strategies> result = entityManager
            .createQuery(
                "select strategies from Strategies strategies left join fetch strategies.resourceses where strategies in :strategieses",
                Strategies.class
            )
            .setParameter(STRATEGIESES_PARAMETER, strategieses)
            .getResultList();
        result.sort((o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
