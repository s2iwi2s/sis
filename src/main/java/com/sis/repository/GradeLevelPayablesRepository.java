package com.sis.repository;

import com.sis.domain.GradeLevelPayables;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GradeLevelPayables entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GradeLevelPayablesRepository extends JpaRepository<GradeLevelPayables, Long> {}
