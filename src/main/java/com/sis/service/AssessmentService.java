package com.sis.service;

import com.sis.service.dto.AssessmentDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Assessment}.
 */
public interface AssessmentService {
    /**
     * Save a assessment.
     *
     * @param assessmentDTO the entity to save.
     * @return the persisted entity.
     */
    AssessmentDTO save(AssessmentDTO assessmentDTO);

    /**
     * Updates a assessment.
     *
     * @param assessmentDTO the entity to update.
     * @return the persisted entity.
     */
    AssessmentDTO update(AssessmentDTO assessmentDTO);

    /**
     * Partially updates a assessment.
     *
     * @param assessmentDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AssessmentDTO> partialUpdate(AssessmentDTO assessmentDTO);

    /**
     * Get all the assessments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AssessmentDTO> findAll(Pageable pageable);

    /**
     * Get all the assessments with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AssessmentDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" assessment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AssessmentDTO> findOne(Long id);

    /**
     * Delete the "id" assessment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    void delete(Long id, Long resourcesId);
}
