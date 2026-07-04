package com.sis.web.rest;

import com.sis.repository.AcademicTermsRepository;
import com.sis.service.AcademicTermsService;
import com.sis.service.dto.AcademicTermsDTO;
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
 * REST controller for managing {@link com.sis.domain.AcademicTerms}.
 */
@RestController
@RequestMapping("/api/academic-terms")
public class AcademicTermsResource {

    private static final Logger LOG = LoggerFactory.getLogger(AcademicTermsResource.class);

    private static final String ENTITY_NAME = "academicTerms";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final AcademicTermsService academicTermsService;

    private final AcademicTermsRepository academicTermsRepository;

    public AcademicTermsResource(AcademicTermsService academicTermsService, AcademicTermsRepository academicTermsRepository) {
        this.academicTermsService = academicTermsService;
        this.academicTermsRepository = academicTermsRepository;
    }

    /**
     * {@code POST  /academic-terms} : Create a new academicTerms.
     *
     * @param academicTermsDTO the academicTermsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new academicTermsDTO, or with status {@code 400 (Bad Request)} if the academicTerms has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AcademicTermsDTO> createAcademicTerms(@Valid @RequestBody AcademicTermsDTO academicTermsDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save AcademicTerms : {}", academicTermsDTO);
        if (academicTermsDTO.getId() != null) {
            throw new BadRequestAlertException("A new academicTerms cannot already have an ID", ENTITY_NAME, "idexists");
        }
        academicTermsDTO = academicTermsService.save(academicTermsDTO);
        return ResponseEntity.created(new URI("/api/academic-terms/" + academicTermsDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, academicTermsDTO.getId().toString()))
            .body(academicTermsDTO);
    }

    /**
     * {@code PUT  /academic-terms/:id} : Updates an existing academicTerms.
     *
     * @param id the id of the academicTermsDTO to save.
     * @param academicTermsDTO the academicTermsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated academicTermsDTO,
     * or with status {@code 400 (Bad Request)} if the academicTermsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the academicTermsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AcademicTermsDTO> updateAcademicTerms(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AcademicTermsDTO academicTermsDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update AcademicTerms : {}, {}", id, academicTermsDTO);
        if (academicTermsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, academicTermsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!academicTermsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        academicTermsDTO = academicTermsService.update(academicTermsDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, academicTermsDTO.getId().toString()))
            .body(academicTermsDTO);
    }

    /**
     * {@code PATCH  /academic-terms/:id} : Partial updates given fields of an existing academicTerms, field will ignore if it is null
     *
     * @param id the id of the academicTermsDTO to save.
     * @param academicTermsDTO the academicTermsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated academicTermsDTO,
     * or with status {@code 400 (Bad Request)} if the academicTermsDTO is not valid,
     * or with status {@code 404 (Not Found)} if the academicTermsDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the academicTermsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AcademicTermsDTO> partialUpdateAcademicTerms(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AcademicTermsDTO academicTermsDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AcademicTerms partially : {}, {}", id, academicTermsDTO);
        if (academicTermsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, academicTermsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!academicTermsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AcademicTermsDTO> result = academicTermsService.partialUpdate(academicTermsDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, academicTermsDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /academic-terms} : get all the Academic Terms.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Academic Terms in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AcademicTermsDTO>> getAllAcademicTermses(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of AcademicTermses");
        Page<AcademicTermsDTO> page = academicTermsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /academic-terms/:id} : get the "id" academicTerms.
     *
     * @param id the id of the academicTermsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the academicTermsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AcademicTermsDTO> getAcademicTerms(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AcademicTerms : {}", id);
        Optional<AcademicTermsDTO> academicTermsDTO = academicTermsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(academicTermsDTO);
    }

    /**
     * {@code DELETE  /academic-terms/:id} : delete the "id" academicTerms.
     *
     * @param id the id of the academicTermsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcademicTerms(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AcademicTerms : {}", id);
        academicTermsService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
