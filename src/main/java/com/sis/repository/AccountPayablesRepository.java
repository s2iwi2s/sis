package com.sis.repository;

import com.sis.domain.AccountPayables;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AccountPayables entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountPayablesRepository extends JpaRepository<AccountPayables, Long> {}
