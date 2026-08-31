package com.sis.web.rest;

import com.sis.repository.EnrollmentRepository;
import com.sis.service.EnrollmentService;
import com.sis.service.dto.EnrollmentDTO;
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
 * REST controller for managing {@link com.sis.domain.Enrollment}.
 */
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnrollmentResource.class);

    private static final String ENTITY_NAME = "enrollment";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final EnrollmentService enrollmentService;

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentResource(EnrollmentService enrollmentService, EnrollmentRepository enrollmentRepository) {
        this.enrollmentService = enrollmentService;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * {@code POST  /enrollments} : Create a new enrollment.
     *
     * @param enrollmentDTO the enrollmentDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new enrollmentDTO, or with status {@code 400 (Bad Request)} if the enrollment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<EnrollmentDTO> createEnrollment(@Valid @RequestBody EnrollmentDTO enrollmentDTO) throws URISyntaxException {
        LOG.debug("REST request to save Enrollment : {}", enrollmentDTO);
        if (enrollmentDTO.getId() != null) {
            throw new BadRequestAlertException("A new enrollment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        enrollmentDTO = enrollmentService.save(enrollmentDTO);
        return ResponseEntity.created(new URI("/api/enrollments/" + enrollmentDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, enrollmentDTO.getId().toString()))
            .body(enrollmentDTO);
    }

    /**
     * {@code PUT  /enrollments/:id} : Updates an existing enrollment.
     *
     * @param id the id of the enrollmentDTO to save.
     * @param enrollmentDTO the enrollmentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enrollmentDTO,
     * or with status {@code 400 (Bad Request)} if the enrollmentDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the enrollmentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentDTO> updateEnrollment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EnrollmentDTO enrollmentDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Enrollment : {}, {}", id, enrollmentDTO);
        if (enrollmentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enrollmentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enrollmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        enrollmentDTO = enrollmentService.update(enrollmentDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enrollmentDTO.getId().toString()))
            .body(enrollmentDTO);
    }

    /**
     * {@code PATCH  /enrollments/:id} : Partial updates given fields of an existing enrollment, field will ignore if it is null
     *
     * @param id the id of the enrollmentDTO to save.
     * @param enrollmentDTO the enrollmentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enrollmentDTO,
     * or with status {@code 400 (Bad Request)} if the enrollmentDTO is not valid,
     * or with status {@code 404 (Not Found)} if the enrollmentDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the enrollmentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EnrollmentDTO> partialUpdateEnrollment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EnrollmentDTO enrollmentDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Enrollment partially : {}, {}", id, enrollmentDTO);
        if (enrollmentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enrollmentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enrollmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EnrollmentDTO> result = enrollmentService.partialUpdate(enrollmentDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enrollmentDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /enrollments} : get all the Enrollments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Enrollments in body.
     */
    @GetMapping("")
    public ResponseEntity<List<EnrollmentDTO>> getAllEnrollments(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Enrollments");
        Page<EnrollmentDTO> page = enrollmentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /enrollments/:id} : get the "id" enrollment.
     *
     * @param id the id of the enrollmentDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the enrollmentDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentDTO> getEnrollment(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Enrollment : {}", id);
        Optional<EnrollmentDTO> enrollmentDTO = enrollmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(enrollmentDTO);
    }

    /**
     * {@code DELETE  /enrollments/:id} : delete the "id" enrollment.
     *
     * @param id the id of the enrollmentDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Enrollment : {}", id);
        enrollmentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
