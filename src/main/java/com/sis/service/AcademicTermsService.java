package com.sis.service;

import com.sis.service.dto.AcademicTermsDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.AcademicTerms}.
 */
public interface AcademicTermsService {
    /**
     * Save a academicTerms.
     *
     * @param academicTermsDTO the entity to save.
     * @return the persisted entity.
     */
    AcademicTermsDTO save(AcademicTermsDTO academicTermsDTO);

    /**
     * Updates a academicTerms.
     *
     * @param academicTermsDTO the entity to update.
     * @return the persisted entity.
     */
    AcademicTermsDTO update(AcademicTermsDTO academicTermsDTO);

    /**
     * Partially updates a academicTerms.
     *
     * @param academicTermsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AcademicTermsDTO> partialUpdate(AcademicTermsDTO academicTermsDTO);

    /**
     * Get all the academicTermses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AcademicTermsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" academicTerms.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AcademicTermsDTO> findOne(Long id);

    /**
     * Delete the "id" academicTerms.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
