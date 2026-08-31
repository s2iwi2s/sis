package com.sis.service;

import com.sis.service.dto.GradeLevelPayablesDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.GradeLevelPayables}.
 */
public interface GradeLevelPayablesService {
    /**
     * Save a gradeLevelPayables.
     *
     * @param gradeLevelPayablesDTO the entity to save.
     * @return the persisted entity.
     */
    GradeLevelPayablesDTO save(GradeLevelPayablesDTO gradeLevelPayablesDTO);

    /**
     * Updates a gradeLevelPayables.
     *
     * @param gradeLevelPayablesDTO the entity to update.
     * @return the persisted entity.
     */
    GradeLevelPayablesDTO update(GradeLevelPayablesDTO gradeLevelPayablesDTO);

    /**
     * Partially updates a gradeLevelPayables.
     *
     * @param gradeLevelPayablesDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<GradeLevelPayablesDTO> partialUpdate(GradeLevelPayablesDTO gradeLevelPayablesDTO);

    /**
     * Get all the gradeLevelPayableses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<GradeLevelPayablesDTO> findAll(Pageable pageable);

    /**
     * Get the "id" gradeLevelPayables.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<GradeLevelPayablesDTO> findOne(Long id);

    /**
     * Delete the "id" gradeLevelPayables.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
