package com.sis.web.rest;

import com.sis.repository.LearningCompetencyRepository;
import com.sis.service.LearningCompetencyService;
import com.sis.service.dto.LearningCompetencyDTO;
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
 * REST controller for managing {@link com.sis.domain.LearningCompetency}.
 */
@RestController
@RequestMapping("/api/learning-competencies")
public class LearningCompetencyResource {

    private static final Logger LOG = LoggerFactory.getLogger(LearningCompetencyResource.class);

    private static final String ENTITY_NAME = "learningCompetency";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final LearningCompetencyService learningCompetencyService;

    private final LearningCompetencyRepository learningCompetencyRepository;

    public LearningCompetencyResource(
        LearningCompetencyService learningCompetencyService,
        LearningCompetencyRepository learningCompetencyRepository
    ) {
        this.learningCompetencyService = learningCompetencyService;
        this.learningCompetencyRepository = learningCompetencyRepository;
    }

    /**
     * {@code POST  /learning-competencies} : Create a new learningCompetency.
     *
     * @param learningCompetencyDTO the learningCompetencyDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new learningCompetencyDTO, or with status {@code 400 (Bad Request)} if the learningCompetency has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LearningCompetencyDTO> createLearningCompetency(@Valid @RequestBody LearningCompetencyDTO learningCompetencyDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save LearningCompetency : {}", learningCompetencyDTO);
        if (learningCompetencyDTO.getId() != null) {
            throw new BadRequestAlertException("A new learningCompetency cannot already have an ID", ENTITY_NAME, "idexists");
        }
        learningCompetencyDTO = learningCompetencyService.save(learningCompetencyDTO);
        return ResponseEntity.created(new URI("/api/learning-competencies/" + learningCompetencyDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, learningCompetencyDTO.getId().toString()))
            .body(learningCompetencyDTO);
    }

    /**
     * {@code PUT  /learning-competencies/:id} : Updates an existing learningCompetency.
     *
     * @param id the id of the learningCompetencyDTO to save.
     * @param learningCompetencyDTO the learningCompetencyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated learningCompetencyDTO,
     * or with status {@code 400 (Bad Request)} if the learningCompetencyDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the learningCompetencyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LearningCompetencyDTO> updateLearningCompetency(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LearningCompetencyDTO learningCompetencyDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update LearningCompetency : {}, {}", id, learningCompetencyDTO);
        if (learningCompetencyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, learningCompetencyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!learningCompetencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        learningCompetencyDTO = learningCompetencyService.update(learningCompetencyDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, learningCompetencyDTO.getId().toString()))
            .body(learningCompetencyDTO);
    }

    /**
     * {@code PATCH  /learning-competencies/:id} : Partial updates given fields of an existing learningCompetency, field will ignore if it is null
     *
     * @param id the id of the learningCompetencyDTO to save.
     * @param learningCompetencyDTO the learningCompetencyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated learningCompetencyDTO,
     * or with status {@code 400 (Bad Request)} if the learningCompetencyDTO is not valid,
     * or with status {@code 404 (Not Found)} if the learningCompetencyDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the learningCompetencyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LearningCompetencyDTO> partialUpdateLearningCompetency(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LearningCompetencyDTO learningCompetencyDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update LearningCompetency partially : {}, {}", id, learningCompetencyDTO);
        if (learningCompetencyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, learningCompetencyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!learningCompetencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LearningCompetencyDTO> result = learningCompetencyService.partialUpdate(learningCompetencyDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, learningCompetencyDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /learning-competencies} : get all the Learning Competencies.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Learning Competencies in body.
     */
    @GetMapping("")
    public ResponseEntity<List<LearningCompetencyDTO>> getAllLearningCompetencies(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of LearningCompetencies");
        Page<LearningCompetencyDTO> page = learningCompetencyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /learning-competencies/:id} : get the "id" learningCompetency.
     *
     * @param id the id of the learningCompetencyDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the learningCompetencyDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LearningCompetencyDTO> getLearningCompetency(@PathVariable("id") Long id) {
        LOG.debug("REST request to get LearningCompetency : {}", id);
        Optional<LearningCompetencyDTO> learningCompetencyDTO = learningCompetencyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(learningCompetencyDTO);
    }

    /**
     * {@code DELETE  /learning-competencies/:id} : delete the "id" learningCompetency.
     *
     * @param id the id of the learningCompetencyDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningCompetency(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete LearningCompetency : {}", id);
        learningCompetencyService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
