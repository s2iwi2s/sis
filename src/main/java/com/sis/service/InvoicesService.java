package com.sis.service;

import com.sis.service.dto.InvoicesDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Invoices}.
 */
public interface InvoicesService {
    /**
     * Save a invoices.
     *
     * @param invoicesDTO the entity to save.
     * @return the persisted entity.
     */
    InvoicesDTO save(InvoicesDTO invoicesDTO);

    /**
     * Updates a invoices.
     *
     * @param invoicesDTO the entity to update.
     * @return the persisted entity.
     */
    InvoicesDTO update(InvoicesDTO invoicesDTO);

    /**
     * Partially updates a invoices.
     *
     * @param invoicesDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<InvoicesDTO> partialUpdate(InvoicesDTO invoicesDTO);

    /**
     * Get all the invoiceses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<InvoicesDTO> findAll(Pageable pageable);

    /**
     * Get the "id" invoices.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<InvoicesDTO> findOne(Long id);

    /**
     * Delete the "id" invoices.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
