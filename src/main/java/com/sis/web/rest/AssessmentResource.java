package com.sis.web.rest;

import com.sis.repository.AssessmentRepository;
import com.sis.service.AssessmentService;
import com.sis.service.dto.AssessmentDTO;
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
 * REST controller for managing {@link com.sis.domain.Assessment}.
 */
@RestController
@RequestMapping("/api/assessments")
public class AssessmentResource {

    private final Logger log = LoggerFactory.getLogger(AssessmentResource.class);

    private static final String ENTITY_NAME = "assessment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AssessmentService assessmentService;

    private final AssessmentRepository assessmentRepository;

    public AssessmentResource(AssessmentService assessmentService, AssessmentRepository assessmentRepository) {
        this.assessmentService = assessmentService;
        this.assessmentRepository = assessmentRepository;
    }

    /**
     * {@code POST  /assessments} : Create a new assessment.
     *
     * @param assessmentDTO the assessmentDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new assessmentDTO, or with status {@code 400 (Bad Request)} if the assessment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AssessmentDTO> createAssessment(@Valid @RequestBody AssessmentDTO assessmentDTO) throws URISyntaxException {
        log.debug("REST request to save Assessment : {}", assessmentDTO);
        if (assessmentDTO.getId() != null) {
            throw new BadRequestAlertException("A new assessment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AssessmentDTO result = assessmentService.save(assessmentDTO);
        return ResponseEntity
            .created(new URI("/api/assessments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /assessments/:id} : Updates an existing assessment.
     *
     * @param id the id of the assessmentDTO to save.
     * @param assessmentDTO the assessmentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated assessmentDTO,
     * or with status {@code 400 (Bad Request)} if the assessmentDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the assessmentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AssessmentDTO> updateAssessment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AssessmentDTO assessmentDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Assessment : {}, {}", id, assessmentDTO);
        if (assessmentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, assessmentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!assessmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AssessmentDTO result = assessmentService.update(assessmentDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, assessmentDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /assessments/:id} : Partial updates given fields of an existing assessment, field will ignore if it is null
     *
     * @param id the id of the assessmentDTO to save.
     * @param assessmentDTO the assessmentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated assessmentDTO,
     * or with status {@code 400 (Bad Request)} if the assessmentDTO is not valid,
     * or with status {@code 404 (Not Found)} if the assessmentDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the assessmentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AssessmentDTO> partialUpdateAssessment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AssessmentDTO assessmentDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Assessment partially : {}, {}", id, assessmentDTO);
        if (assessmentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, assessmentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!assessmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AssessmentDTO> result = assessmentService.partialUpdate(assessmentDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, assessmentDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /assessments} : get all the assessments.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of assessments in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AssessmentDTO>> getAllAssessments(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Assessments");
        Page<AssessmentDTO> page;
        if (eagerload) {
            page = assessmentService.findAllWithEagerRelationships(pageable);
        } else {
            page = assessmentService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /assessments/:id} : get the "id" assessment.
     *
     * @param id the id of the assessmentDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the assessmentDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDTO> getAssessment(@PathVariable("id") Long id) {
        log.debug("REST request to get Assessment : {}", id);
        Optional<AssessmentDTO> assessmentDTO = assessmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(assessmentDTO);
    }

    /**
     * {@code DELETE  /assessments/:id} : delete the "id" assessment.
     *
     * @param id the id of the assessmentDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable("id") Long id) {
        log.debug("REST request to delete Assessment : {}", id);
        assessmentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
