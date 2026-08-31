package com.sis.web.rest;

import com.sis.repository.GradeLevelPayablesRepository;
import com.sis.service.GradeLevelPayablesService;
import com.sis.service.dto.GradeLevelPayablesDTO;
import com.sis.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.sis.domain.GradeLevelPayables}.
 */
@RestController
@RequestMapping("/api/grade-level-payables")
public class GradeLevelPayablesResource {

    private static final Logger LOG = LoggerFactory.getLogger(GradeLevelPayablesResource.class);

    private static final String ENTITY_NAME = "gradeLevelPayables";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final GradeLevelPayablesService gradeLevelPayablesService;

    private final GradeLevelPayablesRepository gradeLevelPayablesRepository;

    public GradeLevelPayablesResource(
        GradeLevelPayablesService gradeLevelPayablesService,
        GradeLevelPayablesRepository gradeLevelPayablesRepository
    ) {
        this.gradeLevelPayablesService = gradeLevelPayablesService;
        this.gradeLevelPayablesRepository = gradeLevelPayablesRepository;
    }

    /**
     * {@code POST  /grade-level-payables} : Create a new gradeLevelPayables.
     *
     * @param gradeLevelPayablesDTO the gradeLevelPayablesDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gradeLevelPayablesDTO, or with status {@code 400 (Bad Request)} if the gradeLevelPayables has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GradeLevelPayablesDTO> createGradeLevelPayables(@RequestBody GradeLevelPayablesDTO gradeLevelPayablesDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save GradeLevelPayables : {}", gradeLevelPayablesDTO);
        if (gradeLevelPayablesDTO.getId() != null) {
            throw new BadRequestAlertException("A new gradeLevelPayables cannot already have an ID", ENTITY_NAME, "idexists");
        }
        gradeLevelPayablesDTO = gradeLevelPayablesService.save(gradeLevelPayablesDTO);
        return ResponseEntity.created(new URI("/api/grade-level-payables/" + gradeLevelPayablesDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, gradeLevelPayablesDTO.getId().toString()))
            .body(gradeLevelPayablesDTO);
    }

    /**
     * {@code PUT  /grade-level-payables/:id} : Updates an existing gradeLevelPayables.
     *
     * @param id the id of the gradeLevelPayablesDTO to save.
     * @param gradeLevelPayablesDTO the gradeLevelPayablesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gradeLevelPayablesDTO,
     * or with status {@code 400 (Bad Request)} if the gradeLevelPayablesDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gradeLevelPayablesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GradeLevelPayablesDTO> updateGradeLevelPayables(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GradeLevelPayablesDTO gradeLevelPayablesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update GradeLevelPayables : {}, {}", id, gradeLevelPayablesDTO);
        if (gradeLevelPayablesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gradeLevelPayablesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gradeLevelPayablesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        gradeLevelPayablesDTO = gradeLevelPayablesService.update(gradeLevelPayablesDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gradeLevelPayablesDTO.getId().toString()))
            .body(gradeLevelPayablesDTO);
    }

    /**
     * {@code PATCH  /grade-level-payables/:id} : Partial updates given fields of an existing gradeLevelPayables, field will ignore if it is null
     *
     * @param id the id of the gradeLevelPayablesDTO to save.
     * @param gradeLevelPayablesDTO the gradeLevelPayablesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gradeLevelPayablesDTO,
     * or with status {@code 400 (Bad Request)} if the gradeLevelPayablesDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gradeLevelPayablesDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gradeLevelPayablesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GradeLevelPayablesDTO> partialUpdateGradeLevelPayables(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GradeLevelPayablesDTO gradeLevelPayablesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update GradeLevelPayables partially : {}, {}", id, gradeLevelPayablesDTO);
        if (gradeLevelPayablesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gradeLevelPayablesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gradeLevelPayablesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GradeLevelPayablesDTO> result = gradeLevelPayablesService.partialUpdate(gradeLevelPayablesDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gradeLevelPayablesDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /grade-level-payables} : get all the Grade Level Payables.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Grade Level Payables in body.
     */
    @GetMapping("")
    public ResponseEntity<List<GradeLevelPayablesDTO>> getAllGradeLevelPayableses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of GradeLevelPayableses");
        Page<GradeLevelPayablesDTO> page = gradeLevelPayablesService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /grade-level-payables/:id} : get the "id" gradeLevelPayables.
     *
     * @param id the id of the gradeLevelPayablesDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gradeLevelPayablesDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GradeLevelPayablesDTO> getGradeLevelPayables(@PathVariable("id") Long id) {
        LOG.debug("REST request to get GradeLevelPayables : {}", id);
        Optional<GradeLevelPayablesDTO> gradeLevelPayablesDTO = gradeLevelPayablesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gradeLevelPayablesDTO);
    }

    /**
     * {@code DELETE  /grade-level-payables/:id} : delete the "id" gradeLevelPayables.
     *
     * @param id the id of the gradeLevelPayablesDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGradeLevelPayables(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete GradeLevelPayables : {}", id);
        gradeLevelPayablesService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
