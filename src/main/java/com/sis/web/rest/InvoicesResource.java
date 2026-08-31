package com.sis.web.rest;

import com.sis.repository.InvoicesRepository;
import com.sis.service.InvoicesService;
import com.sis.service.dto.InvoicesDTO;
import com.sis.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.sis.domain.Invoices}.
 */
@RestController
@RequestMapping("/api/invoices")
public class InvoicesResource {

    private static final Logger LOG = LoggerFactory.getLogger(InvoicesResource.class);

    private static final String ENTITY_NAME = "invoices";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final InvoicesService invoicesService;

    private final InvoicesRepository invoicesRepository;

    public InvoicesResource(InvoicesService invoicesService, InvoicesRepository invoicesRepository) {
        this.invoicesService = invoicesService;
        this.invoicesRepository = invoicesRepository;
    }

    /**
     * {@code POST  /invoices} : Create a new invoices.
     *
     * @param invoicesDTO the invoicesDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new invoicesDTO, or with status {@code 400 (Bad Request)} if the invoices has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<InvoicesDTO> createInvoices(@Valid @RequestBody InvoicesDTO invoicesDTO) throws URISyntaxException {
        LOG.debug("REST request to save Invoices : {}", invoicesDTO);
        if (invoicesDTO.getId() != null) {
            throw new BadRequestAlertException("A new invoices cannot already have an ID", ENTITY_NAME, "idexists");
        }
        invoicesDTO = invoicesService.save(invoicesDTO);
        return ResponseEntity.created(new URI("/api/invoices/" + invoicesDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, invoicesDTO.getId().toString()))
            .body(invoicesDTO);
    }

    /**
     * {@code PUT  /invoices/:id} : Updates an existing invoices.
     *
     * @param id the id of the invoicesDTO to save.
     * @param invoicesDTO the invoicesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated invoicesDTO,
     * or with status {@code 400 (Bad Request)} if the invoicesDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the invoicesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<InvoicesDTO> updateInvoices(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody InvoicesDTO invoicesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Invoices : {}, {}", id, invoicesDTO);
        if (invoicesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, invoicesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!invoicesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        invoicesDTO = invoicesService.update(invoicesDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, invoicesDTO.getId().toString()))
            .body(invoicesDTO);
    }

    /**
     * {@code PATCH  /invoices/:id} : Partial updates given fields of an existing invoices, field will ignore if it is null
     *
     * @param id the id of the invoicesDTO to save.
     * @param invoicesDTO the invoicesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated invoicesDTO,
     * or with status {@code 400 (Bad Request)} if the invoicesDTO is not valid,
     * or with status {@code 404 (Not Found)} if the invoicesDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the invoicesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InvoicesDTO> partialUpdateInvoices(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody InvoicesDTO invoicesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Invoices partially : {}, {}", id, invoicesDTO);
        if (invoicesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, invoicesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!invoicesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InvoicesDTO> result = invoicesService.partialUpdate(invoicesDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, invoicesDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /invoices} : get all the Invoices.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Invoices in body.
     */
    @GetMapping("")
    public ResponseEntity<List<InvoicesDTO>> getAllInvoiceses(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Invoiceses");
        Page<InvoicesDTO> page = invoicesService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /invoices/:id} : get the "id" invoices.
     *
     * @param id the id of the invoicesDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the invoicesDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InvoicesDTO> getInvoices(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Invoices : {}", id);
        Optional<InvoicesDTO> invoicesDTO = invoicesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(invoicesDTO);
    }

    /**
     * {@code DELETE  /invoices/:id} : delete the "id" invoices.
     *
     * @param id the id of the invoicesDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoices(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Invoices : {}", id);
        invoicesService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
