package com.sis.web.rest;

import com.sis.repository.ClassScheduleRepository;
import com.sis.service.ClassScheduleService;
import com.sis.service.dto.ClassScheduleDTO;
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
 * REST controller for managing {@link com.sis.domain.ClassSchedule}.
 */
@RestController
@RequestMapping("/api/class-schedules")
public class ClassScheduleResource {

    private static final Logger LOG = LoggerFactory.getLogger(ClassScheduleResource.class);

    private static final String ENTITY_NAME = "classSchedule";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final ClassScheduleService classScheduleService;

    private final ClassScheduleRepository classScheduleRepository;

    public ClassScheduleResource(ClassScheduleService classScheduleService, ClassScheduleRepository classScheduleRepository) {
        this.classScheduleService = classScheduleService;
        this.classScheduleRepository = classScheduleRepository;
    }

    /**
     * {@code POST  /class-schedules} : Create a new classSchedule.
     *
     * @param classScheduleDTO the classScheduleDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new classScheduleDTO, or with status {@code 400 (Bad Request)} if the classSchedule has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ClassScheduleDTO> createClassSchedule(@Valid @RequestBody ClassScheduleDTO classScheduleDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ClassSchedule : {}", classScheduleDTO);
        if (classScheduleDTO.getId() != null) {
            throw new BadRequestAlertException("A new classSchedule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        classScheduleDTO = classScheduleService.save(classScheduleDTO);
        return ResponseEntity.created(new URI("/api/class-schedules/" + classScheduleDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, classScheduleDTO.getId().toString()))
            .body(classScheduleDTO);
    }

    /**
     * {@code PUT  /class-schedules/:id} : Updates an existing classSchedule.
     *
     * @param id the id of the classScheduleDTO to save.
     * @param classScheduleDTO the classScheduleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classScheduleDTO,
     * or with status {@code 400 (Bad Request)} if the classScheduleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the classScheduleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClassScheduleDTO> updateClassSchedule(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ClassScheduleDTO classScheduleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ClassSchedule : {}, {}", id, classScheduleDTO);
        if (classScheduleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classScheduleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classScheduleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        classScheduleDTO = classScheduleService.update(classScheduleDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classScheduleDTO.getId().toString()))
            .body(classScheduleDTO);
    }

    /**
     * {@code PATCH  /class-schedules/:id} : Partial updates given fields of an existing classSchedule, field will ignore if it is null
     *
     * @param id the id of the classScheduleDTO to save.
     * @param classScheduleDTO the classScheduleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classScheduleDTO,
     * or with status {@code 400 (Bad Request)} if the classScheduleDTO is not valid,
     * or with status {@code 404 (Not Found)} if the classScheduleDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the classScheduleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClassScheduleDTO> partialUpdateClassSchedule(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ClassScheduleDTO classScheduleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ClassSchedule partially : {}, {}", id, classScheduleDTO);
        if (classScheduleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classScheduleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classScheduleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClassScheduleDTO> result = classScheduleService.partialUpdate(classScheduleDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classScheduleDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /class-schedules} : get all the Class Schedules.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Class Schedules in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ClassScheduleDTO>> getAllClassSchedules(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of ClassSchedules");
        Page<ClassScheduleDTO> page = classScheduleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /class-schedules/:id} : get the "id" classSchedule.
     *
     * @param id the id of the classScheduleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the classScheduleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClassScheduleDTO> getClassSchedule(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ClassSchedule : {}", id);
        Optional<ClassScheduleDTO> classScheduleDTO = classScheduleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(classScheduleDTO);
    }

    /**
     * {@code DELETE  /class-schedules/:id} : delete the "id" classSchedule.
     *
     * @param id the id of the classScheduleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassSchedule(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ClassSchedule : {}", id);
        classScheduleService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
