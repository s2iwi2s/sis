package com.sis.web.rest;

import com.sis.repository.StrategiesRepository;
import com.sis.service.StrategiesService;
import com.sis.service.dto.StrategiesDTO;
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
 * REST controller for managing {@link com.sis.domain.Strategies}.
 */
@RestController
@RequestMapping("/api/strategies")
public class StrategiesResource {

    private static final Logger LOG = LoggerFactory.getLogger(StrategiesResource.class);

    private static final String ENTITY_NAME = "strategies";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final StrategiesService strategiesService;

    private final StrategiesRepository strategiesRepository;

    public StrategiesResource(StrategiesService strategiesService, StrategiesRepository strategiesRepository) {
        this.strategiesService = strategiesService;
        this.strategiesRepository = strategiesRepository;
    }

    /**
     * {@code POST  /strategies} : Create a new strategies.
     *
     * @param strategiesDTO the strategiesDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new strategiesDTO, or with status {@code 400 (Bad Request)} if the strategies has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<StrategiesDTO> createStrategies(@Valid @RequestBody StrategiesDTO strategiesDTO) throws URISyntaxException {
        LOG.debug("REST request to save Strategies : {}", strategiesDTO);
        if (strategiesDTO.getId() != null) {
            throw new BadRequestAlertException("A new strategies cannot already have an ID", ENTITY_NAME, "idexists");
        }
        strategiesDTO = strategiesService.save(strategiesDTO);
        return ResponseEntity.created(new URI("/api/strategies/" + strategiesDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, strategiesDTO.getId().toString()))
            .body(strategiesDTO);
    }

    /**
     * {@code PUT  /strategies/:id} : Updates an existing strategies.
     *
     * @param id the id of the strategiesDTO to save.
     * @param strategiesDTO the strategiesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated strategiesDTO,
     * or with status {@code 400 (Bad Request)} if the strategiesDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the strategiesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<StrategiesDTO> updateStrategies(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StrategiesDTO strategiesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Strategies : {}, {}", id, strategiesDTO);
        if (strategiesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, strategiesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!strategiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        strategiesDTO = strategiesService.update(strategiesDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, strategiesDTO.getId().toString()))
            .body(strategiesDTO);
    }

    /**
     * {@code PATCH  /strategies/:id} : Partial updates given fields of an existing strategies, field will ignore if it is null
     *
     * @param id the id of the strategiesDTO to save.
     * @param strategiesDTO the strategiesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated strategiesDTO,
     * or with status {@code 400 (Bad Request)} if the strategiesDTO is not valid,
     * or with status {@code 404 (Not Found)} if the strategiesDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the strategiesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StrategiesDTO> partialUpdateStrategies(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StrategiesDTO strategiesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Strategies partially : {}, {}", id, strategiesDTO);
        if (strategiesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, strategiesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!strategiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StrategiesDTO> result = strategiesService.partialUpdate(strategiesDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, strategiesDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /strategies} : get all the Strategies.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Strategies in body.
     */
    @GetMapping("")
    public ResponseEntity<List<StrategiesDTO>> getAllStrategieses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Strategieses");
        Page<StrategiesDTO> page;
        if (eagerload) {
            page = strategiesService.findAllWithEagerRelationships(pageable);
        } else {
            page = strategiesService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /strategies/:id} : get the "id" strategies.
     *
     * @param id the id of the strategiesDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the strategiesDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StrategiesDTO> getStrategies(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Strategies : {}", id);
        Optional<StrategiesDTO> strategiesDTO = strategiesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(strategiesDTO);
    }

    /**
     * {@code DELETE  /strategies/:id} : delete the "id" strategies.
     *
     * @param id the id of the strategiesDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStrategies(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Strategies : {}", id);
        strategiesService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/{id}/course")
    public ResponseEntity<List<StrategiesDTO>> getAllStrategiesByCourse(@PathVariable("id") Long courseId) {
        LOG.debug("REST request to get a page of Strategies by Course {}", courseId);
        List<StrategiesDTO> list = strategiesService.findAllByCourse(courseId);
        return ResponseEntity.ok(list);
    }
}
