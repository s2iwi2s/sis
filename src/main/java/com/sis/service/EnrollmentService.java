package com.sis.service;

import com.sis.service.dto.EnrollmentDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Enrollment}.
 */
public interface EnrollmentService {
    /**
     * Save a enrollment.
     *
     * @param enrollmentDTO the entity to save.
     * @return the persisted entity.
     */
    EnrollmentDTO save(EnrollmentDTO enrollmentDTO);

    /**
     * Updates a enrollment.
     *
     * @param enrollmentDTO the entity to update.
     * @return the persisted entity.
     */
    EnrollmentDTO update(EnrollmentDTO enrollmentDTO);

    /**
     * Partially updates a enrollment.
     *
     * @param enrollmentDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EnrollmentDTO> partialUpdate(EnrollmentDTO enrollmentDTO);

    /**
     * Get all the enrollments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EnrollmentDTO> findAll(Pageable pageable);

    /**
     * Get the "id" enrollment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EnrollmentDTO> findOne(Long id);

    /**
     * Delete the "id" enrollment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
