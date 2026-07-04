package com.sis.service;

import com.sis.service.dto.StrategiesDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Strategies}.
 */
public interface StrategiesService {
    /**
     * Save a strategies.
     *
     * @param strategiesDTO the entity to save.
     * @return the persisted entity.
     */
    StrategiesDTO save(StrategiesDTO strategiesDTO);

    /**
     * Updates a strategies.
     *
     * @param strategiesDTO the entity to update.
     * @return the persisted entity.
     */
    StrategiesDTO update(StrategiesDTO strategiesDTO);

    /**
     * Partially updates a strategies.
     *
     * @param strategiesDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<StrategiesDTO> partialUpdate(StrategiesDTO strategiesDTO);

    /**
     * Get all the strategieses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<StrategiesDTO> findAll(Pageable pageable);

    /**
     * Get all the strategieses with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<StrategiesDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" strategies.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<StrategiesDTO> findOne(Long id);

    /**
     * Delete the "id" strategies.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
