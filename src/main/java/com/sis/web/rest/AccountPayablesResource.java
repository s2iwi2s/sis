package com.sis.web.rest;

import com.sis.repository.AccountPayablesRepository;
import com.sis.service.AccountPayablesService;
import com.sis.service.dto.AccountPayablesDTO;
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
 * REST controller for managing {@link com.sis.domain.AccountPayables}.
 */
@RestController
@RequestMapping("/api/account-payables")
public class AccountPayablesResource {

    private static final Logger LOG = LoggerFactory.getLogger(AccountPayablesResource.class);

    private static final String ENTITY_NAME = "accountPayables";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final AccountPayablesService accountPayablesService;

    private final AccountPayablesRepository accountPayablesRepository;

    public AccountPayablesResource(AccountPayablesService accountPayablesService, AccountPayablesRepository accountPayablesRepository) {
        this.accountPayablesService = accountPayablesService;
        this.accountPayablesRepository = accountPayablesRepository;
    }

    /**
     * {@code POST  /account-payables} : Create a new accountPayables.
     *
     * @param accountPayablesDTO the accountPayablesDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountPayablesDTO, or with status {@code 400 (Bad Request)} if the accountPayables has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AccountPayablesDTO> createAccountPayables(@Valid @RequestBody AccountPayablesDTO accountPayablesDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save AccountPayables : {}", accountPayablesDTO);
        if (accountPayablesDTO.getId() != null) {
            throw new BadRequestAlertException("A new accountPayables cannot already have an ID", ENTITY_NAME, "idexists");
        }
        accountPayablesDTO = accountPayablesService.save(accountPayablesDTO);
        return ResponseEntity.created(new URI("/api/account-payables/" + accountPayablesDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, accountPayablesDTO.getId().toString()))
            .body(accountPayablesDTO);
    }

    /**
     * {@code PUT  /account-payables/:id} : Updates an existing accountPayables.
     *
     * @param id the id of the accountPayablesDTO to save.
     * @param accountPayablesDTO the accountPayablesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountPayablesDTO,
     * or with status {@code 400 (Bad Request)} if the accountPayablesDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountPayablesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AccountPayablesDTO> updateAccountPayables(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AccountPayablesDTO accountPayablesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update AccountPayables : {}, {}", id, accountPayablesDTO);
        if (accountPayablesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountPayablesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountPayablesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        accountPayablesDTO = accountPayablesService.update(accountPayablesDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountPayablesDTO.getId().toString()))
            .body(accountPayablesDTO);
    }

    /**
     * {@code PATCH  /account-payables/:id} : Partial updates given fields of an existing accountPayables, field will ignore if it is null
     *
     * @param id the id of the accountPayablesDTO to save.
     * @param accountPayablesDTO the accountPayablesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountPayablesDTO,
     * or with status {@code 400 (Bad Request)} if the accountPayablesDTO is not valid,
     * or with status {@code 404 (Not Found)} if the accountPayablesDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountPayablesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AccountPayablesDTO> partialUpdateAccountPayables(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AccountPayablesDTO accountPayablesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AccountPayables partially : {}, {}", id, accountPayablesDTO);
        if (accountPayablesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountPayablesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountPayablesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AccountPayablesDTO> result = accountPayablesService.partialUpdate(accountPayablesDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountPayablesDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /account-payables} : get all the Account Payables.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Account Payables in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AccountPayablesDTO>> getAllAccountPayableses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of AccountPayableses");
        Page<AccountPayablesDTO> page = accountPayablesService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /account-payables/:id} : get the "id" accountPayables.
     *
     * @param id the id of the accountPayablesDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountPayablesDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccountPayablesDTO> getAccountPayables(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AccountPayables : {}", id);
        Optional<AccountPayablesDTO> accountPayablesDTO = accountPayablesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(accountPayablesDTO);
    }

    /**
     * {@code DELETE  /account-payables/:id} : delete the "id" accountPayables.
     *
     * @param id the id of the accountPayablesDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccountPayables(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AccountPayables : {}", id);
        accountPayablesService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
