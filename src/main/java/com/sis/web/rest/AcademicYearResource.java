package com.sis.web.rest;

import com.sis.repository.AcademicYearRepository;
import com.sis.service.AcademicYearService;
import com.sis.service.dto.AcademicYearDTO;
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
 * REST controller for managing {@link com.sis.domain.AcademicYear}.
 */
@RestController
@RequestMapping("/api/academic-years")
public class AcademicYearResource {

    private static final Logger LOG = LoggerFactory.getLogger(AcademicYearResource.class);

    private static final String ENTITY_NAME = "academicYear";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final AcademicYearService academicYearService;

    private final AcademicYearRepository academicYearRepository;

    public AcademicYearResource(AcademicYearService academicYearService, AcademicYearRepository academicYearRepository) {
        this.academicYearService = academicYearService;
        this.academicYearRepository = academicYearRepository;
    }

    /**
     * {@code POST  /academic-years} : Create a new academicYear.
     *
     * @param academicYearDTO the academicYearDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new academicYearDTO, or with status {@code 400 (Bad Request)} if the academicYear has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AcademicYearDTO> createAcademicYear(@Valid @RequestBody AcademicYearDTO academicYearDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save AcademicYear : {}", academicYearDTO);
        if (academicYearDTO.getId() != null) {
            throw new BadRequestAlertException("A new academicYear cannot already have an ID", ENTITY_NAME, "idexists");
        }
        academicYearDTO = academicYearService.save(academicYearDTO);
        return ResponseEntity.created(new URI("/api/academic-years/" + academicYearDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, academicYearDTO.getId().toString()))
            .body(academicYearDTO);
    }

    /**
     * {@code PUT  /academic-years/:id} : Updates an existing academicYear.
     *
     * @param id the id of the academicYearDTO to save.
     * @param academicYearDTO the academicYearDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated academicYearDTO,
     * or with status {@code 400 (Bad Request)} if the academicYearDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the academicYearDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AcademicYearDTO> updateAcademicYear(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AcademicYearDTO academicYearDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update AcademicYear : {}, {}", id, academicYearDTO);
        if (academicYearDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, academicYearDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!academicYearRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        academicYearDTO = academicYearService.update(academicYearDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, academicYearDTO.getId().toString()))
            .body(academicYearDTO);
    }

    /**
     * {@code PATCH  /academic-years/:id} : Partial updates given fields of an existing academicYear, field will ignore if it is null
     *
     * @param id the id of the academicYearDTO to save.
     * @param academicYearDTO the academicYearDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated academicYearDTO,
     * or with status {@code 400 (Bad Request)} if the academicYearDTO is not valid,
     * or with status {@code 404 (Not Found)} if the academicYearDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the academicYearDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AcademicYearDTO> partialUpdateAcademicYear(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AcademicYearDTO academicYearDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AcademicYear partially : {}, {}", id, academicYearDTO);
        if (academicYearDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, academicYearDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!academicYearRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AcademicYearDTO> result = academicYearService.partialUpdate(academicYearDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, academicYearDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /academic-years} : get all the Academic Years.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Academic Years in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AcademicYearDTO>> getAllAcademicYears(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of AcademicYears");
        Page<AcademicYearDTO> page = academicYearService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /academic-years/:id} : get the "id" academicYear.
     *
     * @param id the id of the academicYearDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the academicYearDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AcademicYearDTO> getAcademicYear(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AcademicYear : {}", id);
        Optional<AcademicYearDTO> academicYearDTO = academicYearService.findOne(id);
        return ResponseUtil.wrapOrNotFound(academicYearDTO);
    }

    /**
     * {@code DELETE  /academic-years/:id} : delete the "id" academicYear.
     *
     * @param id the id of the academicYearDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcademicYear(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AcademicYear : {}", id);
        academicYearService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
