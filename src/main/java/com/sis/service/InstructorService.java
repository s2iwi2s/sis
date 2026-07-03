package com.sis.service;

import com.sis.service.dto.InstructorDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Instructor}.
 */
public interface InstructorService {
    /**
     * Save a instructor.
     *
     * @param instructorDTO the entity to save.
     * @return the persisted entity.
     */
    InstructorDTO save(InstructorDTO instructorDTO);

    /**
     * Updates a instructor.
     *
     * @param instructorDTO the entity to update.
     * @return the persisted entity.
     */
    InstructorDTO update(InstructorDTO instructorDTO);

    /**
     * Partially updates a instructor.
     *
     * @param instructorDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<InstructorDTO> partialUpdate(InstructorDTO instructorDTO);

    /**
     * Get all the instructors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<InstructorDTO> findAll(Pageable pageable);

    /**
     * Get the "id" instructor.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<InstructorDTO> findOne(Long id);

    /**
     * Delete the "id" instructor.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
