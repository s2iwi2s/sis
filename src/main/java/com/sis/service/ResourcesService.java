package com.sis.service;

import com.sis.service.dto.ResourcesDTO;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Resources}.
 */
public interface ResourcesService {
    /**
     * Save a resources.
     *
     * @param resourcesDTO the entity to save.
     * @return the persisted entity.
     */
    ResourcesDTO save(ResourcesDTO resourcesDTO);

    /**
     * Updates a resources.
     *
     * @param resourcesDTO the entity to update.
     * @return the persisted entity.
     */
    ResourcesDTO update(ResourcesDTO resourcesDTO);

    /**
     * Partially updates a resources.
     *
     * @param resourcesDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ResourcesDTO> partialUpdate(ResourcesDTO resourcesDTO);

    /**
     * Get all the resources.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ResourcesDTO> findAll(Pageable pageable);

    /**
     * Get the "id" resources.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ResourcesDTO> findOne(Long id);

    /**
     * Delete the "id" resources.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    Set<ResourcesDTO> findResourcesByAssessments(Long assessmentId);
}
