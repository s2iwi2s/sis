package com.sis.service;

import com.sis.service.dto.AcademicYearDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.AcademicYear}.
 */
public interface AcademicYearService {
    /**
     * Save a academicYear.
     *
     * @param academicYearDTO the entity to save.
     * @return the persisted entity.
     */
    AcademicYearDTO save(AcademicYearDTO academicYearDTO);

    /**
     * Updates a academicYear.
     *
     * @param academicYearDTO the entity to update.
     * @return the persisted entity.
     */
    AcademicYearDTO update(AcademicYearDTO academicYearDTO);

    /**
     * Partially updates a academicYear.
     *
     * @param academicYearDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AcademicYearDTO> partialUpdate(AcademicYearDTO academicYearDTO);

    /**
     * Get all the academicYears.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AcademicYearDTO> findAll(Pageable pageable);

    /**
     * Get the "id" academicYear.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AcademicYearDTO> findOne(Long id);

    /**
     * Delete the "id" academicYear.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
