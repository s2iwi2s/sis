package com.sis.repository;

import com.sis.domain.AcademicTerms;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AcademicTerms entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AcademicTermsRepository extends JpaRepository<AcademicTerms, Long> {}
