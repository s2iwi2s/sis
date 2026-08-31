package com.sis.service;

import com.sis.service.dto.AccountPayablesDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.AccountPayables}.
 */
public interface AccountPayablesService {
    /**
     * Save a accountPayables.
     *
     * @param accountPayablesDTO the entity to save.
     * @return the persisted entity.
     */
    AccountPayablesDTO save(AccountPayablesDTO accountPayablesDTO);

    /**
     * Updates a accountPayables.
     *
     * @param accountPayablesDTO the entity to update.
     * @return the persisted entity.
     */
    AccountPayablesDTO update(AccountPayablesDTO accountPayablesDTO);

    /**
     * Partially updates a accountPayables.
     *
     * @param accountPayablesDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AccountPayablesDTO> partialUpdate(AccountPayablesDTO accountPayablesDTO);

    /**
     * Get all the accountPayableses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AccountPayablesDTO> findAll(Pageable pageable);

    /**
     * Get the "id" accountPayables.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AccountPayablesDTO> findOne(Long id);

    /**
     * Delete the "id" accountPayables.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
