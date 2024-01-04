package com.sis.service;

import com.sis.service.dto.OrgDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Org}.
 */
public interface OrgService {
    /**
     * Save a org.
     *
     * @param orgDTO the entity to save.
     * @return the persisted entity.
     */
    OrgDTO save(OrgDTO orgDTO);

    /**
     * Updates a org.
     *
     * @param orgDTO the entity to update.
     * @return the persisted entity.
     */
    OrgDTO update(OrgDTO orgDTO);

    /**
     * Partially updates a org.
     *
     * @param orgDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrgDTO> partialUpdate(OrgDTO orgDTO);

    /**
     * Get all the orgs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrgDTO> findAll(Pageable pageable);

    /**
     * Get the "id" org.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrgDTO> findOne(Long id);

    /**
     * Delete the "id" org.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
