package com.sis.repository;

import com.sis.domain.Strategies;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Strategies entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StrategiesRepository extends JpaRepository<Strategies, Long> {}
