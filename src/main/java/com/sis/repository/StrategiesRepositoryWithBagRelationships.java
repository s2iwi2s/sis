package com.sis.repository;

import com.sis.domain.Strategies;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface StrategiesRepositoryWithBagRelationships {
    Optional<Strategies> fetchBagRelationships(Optional<Strategies> strategies);

    List<Strategies> fetchBagRelationships(List<Strategies> strategies);

    Page<Strategies> fetchBagRelationships(Page<Strategies> strategies);
}
