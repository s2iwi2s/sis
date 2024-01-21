package com.sis.web.rest;

import com.sis.repository.CurriculumMapRepository;
import com.sis.service.CurriculumMapService;
import com.sis.service.dto.CurriculumMapDTO;
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
 * REST controller for managing {@link com.sis.domain.CurriculumMap}.
 */
@RestController
@RequestMapping("/api/curriculum-maps")
public class CurriculumMapResource {

    private final Logger log = LoggerFactory.getLogger(CurriculumMapResource.class);

    private static final String ENTITY_NAME = "curriculumMap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CurriculumMapService curriculumMapService;

    private final CurriculumMapRepository curriculumMapRepository;

    public CurriculumMapResource(CurriculumMapService curriculumMapService, CurriculumMapRepository curriculumMapRepository) {
        this.curriculumMapService = curriculumMapService;
        this.curriculumMapRepository = curriculumMapRepository;
    }

    /**
     * {@code POST  /curriculum-maps} : Create a new curriculumMap.
     *
     * @param curriculumMapDTO the curriculumMapDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new curriculumMapDTO, or with status {@code 400 (Bad Request)} if the curriculumMap has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CurriculumMapDTO> createCurriculumMap(@Valid @RequestBody CurriculumMapDTO curriculumMapDTO)
        throws URISyntaxException {
        log.debug("REST request to save CurriculumMap : {}", curriculumMapDTO);
        if (curriculumMapDTO.getId() != null) {
            throw new BadRequestAlertException("A new curriculumMap cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CurriculumMapDTO result = curriculumMapService.save(curriculumMapDTO);
        return ResponseEntity
            .created(new URI("/api/curriculum-maps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /curriculum-maps/:id} : Updates an existing curriculumMap.
     *
     * @param id the id of the curriculumMapDTO to save.
     * @param curriculumMapDTO the curriculumMapDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated curriculumMapDTO,
     * or with status {@code 400 (Bad Request)} if the curriculumMapDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the curriculumMapDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CurriculumMapDTO> updateCurriculumMap(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CurriculumMapDTO curriculumMapDTO
    ) throws URISyntaxException {
        log.debug("REST request to update CurriculumMap : {}, {}", id, curriculumMapDTO);
        if (curriculumMapDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, curriculumMapDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!curriculumMapRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CurriculumMapDTO result = curriculumMapService.update(curriculumMapDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, curriculumMapDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /curriculum-maps/:id} : Partial updates given fields of an existing curriculumMap, field will ignore if it is null
     *
     * @param id the id of the curriculumMapDTO to save.
     * @param curriculumMapDTO the curriculumMapDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated curriculumMapDTO,
     * or with status {@code 400 (Bad Request)} if the curriculumMapDTO is not valid,
     * or with status {@code 404 (Not Found)} if the curriculumMapDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the curriculumMapDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CurriculumMapDTO> partialUpdateCurriculumMap(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CurriculumMapDTO curriculumMapDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update CurriculumMap partially : {}, {}", id, curriculumMapDTO);
        if (curriculumMapDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, curriculumMapDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!curriculumMapRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CurriculumMapDTO> result = curriculumMapService.partialUpdate(curriculumMapDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, curriculumMapDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /curriculum-maps} : get all the curriculumMaps.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of curriculumMaps in body.
     */
    @GetMapping("")
    public ResponseEntity<List<CurriculumMapDTO>> getAllCurriculumMaps(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of CurriculumMaps");
        Page<CurriculumMapDTO> page = curriculumMapService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /curriculum-maps/:id} : get the "id" curriculumMap.
     *
     * @param id the id of the curriculumMapDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the curriculumMapDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CurriculumMapDTO> getCurriculumMap(@PathVariable("id") Long id) {
        log.debug("REST request to get CurriculumMap : {}", id);
        Optional<CurriculumMapDTO> curriculumMapDTO = curriculumMapService.findOne(id);
        return ResponseUtil.wrapOrNotFound(curriculumMapDTO);
    }

    /**
     * {@code DELETE  /curriculum-maps/:id} : delete the "id" curriculumMap.
     *
     * @param id the id of the curriculumMapDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurriculumMap(@PathVariable("id") Long id) {
        log.debug("REST request to delete CurriculumMap : {}", id);
        curriculumMapService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
    @GetMapping("/{id}/course")
    public ResponseEntity<List<CurriculumMapDTO>> getCurriculumMapByCourse(@PathVariable("id") Long courseId) {
        log.debug("REST request to get CurriculumMap By Course: {}", courseId);
        List<CurriculumMapDTO> curriculumMapDTOs = curriculumMapService.findByCourse(courseId);
        return ResponseEntity.ok(curriculumMapDTOs);
    }
}
