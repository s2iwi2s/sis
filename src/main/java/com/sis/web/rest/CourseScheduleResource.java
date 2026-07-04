package com.sis.web.rest;

import com.sis.repository.CourseScheduleRepository;
import com.sis.service.CourseScheduleService;
import com.sis.service.dto.CourseScheduleDTO;
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
 * REST controller for managing {@link com.sis.domain.CourseSchedule}.
 */
@RestController
@RequestMapping("/api/course-schedules")
public class CourseScheduleResource {

    private static final Logger LOG = LoggerFactory.getLogger(CourseScheduleResource.class);

    private static final String ENTITY_NAME = "courseSchedule";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final CourseScheduleService courseScheduleService;

    private final CourseScheduleRepository courseScheduleRepository;

    public CourseScheduleResource(CourseScheduleService courseScheduleService, CourseScheduleRepository courseScheduleRepository) {
        this.courseScheduleService = courseScheduleService;
        this.courseScheduleRepository = courseScheduleRepository;
    }

    /**
     * {@code POST  /course-schedules} : Create a new courseSchedule.
     *
     * @param courseScheduleDTO the courseScheduleDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new courseScheduleDTO, or with status {@code 400 (Bad Request)} if the courseSchedule has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CourseScheduleDTO> createCourseSchedule(@Valid @RequestBody CourseScheduleDTO courseScheduleDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save CourseSchedule : {}", courseScheduleDTO);
        if (courseScheduleDTO.getId() != null) {
            throw new BadRequestAlertException("A new courseSchedule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        courseScheduleDTO = courseScheduleService.save(courseScheduleDTO);
        return ResponseEntity.created(new URI("/api/course-schedules/" + courseScheduleDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, courseScheduleDTO.getId().toString()))
            .body(courseScheduleDTO);
    }

    /**
     * {@code PUT  /course-schedules/:id} : Updates an existing courseSchedule.
     *
     * @param id the id of the courseScheduleDTO to save.
     * @param courseScheduleDTO the courseScheduleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseScheduleDTO,
     * or with status {@code 400 (Bad Request)} if the courseScheduleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the courseScheduleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CourseScheduleDTO> updateCourseSchedule(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CourseScheduleDTO courseScheduleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update CourseSchedule : {}, {}", id, courseScheduleDTO);
        if (courseScheduleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseScheduleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseScheduleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        courseScheduleDTO = courseScheduleService.update(courseScheduleDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseScheduleDTO.getId().toString()))
            .body(courseScheduleDTO);
    }

    /**
     * {@code PATCH  /course-schedules/:id} : Partial updates given fields of an existing courseSchedule, field will ignore if it is null
     *
     * @param id the id of the courseScheduleDTO to save.
     * @param courseScheduleDTO the courseScheduleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseScheduleDTO,
     * or with status {@code 400 (Bad Request)} if the courseScheduleDTO is not valid,
     * or with status {@code 404 (Not Found)} if the courseScheduleDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the courseScheduleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CourseScheduleDTO> partialUpdateCourseSchedule(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CourseScheduleDTO courseScheduleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update CourseSchedule partially : {}, {}", id, courseScheduleDTO);
        if (courseScheduleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseScheduleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseScheduleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CourseScheduleDTO> result = courseScheduleService.partialUpdate(courseScheduleDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseScheduleDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /course-schedules} : get all the Course Schedules.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Course Schedules in body.
     */
    @GetMapping("")
    public ResponseEntity<List<CourseScheduleDTO>> getAllCourseSchedules(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of CourseSchedules");
        Page<CourseScheduleDTO> page = courseScheduleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /course-schedules/:id} : get the "id" courseSchedule.
     *
     * @param id the id of the courseScheduleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the courseScheduleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseScheduleDTO> getCourseSchedule(@PathVariable("id") Long id) {
        LOG.debug("REST request to get CourseSchedule : {}", id);
        Optional<CourseScheduleDTO> courseScheduleDTO = courseScheduleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(courseScheduleDTO);
    }

    /**
     * {@code DELETE  /course-schedules/:id} : delete the "id" courseSchedule.
     *
     * @param id the id of the courseScheduleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourseSchedule(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete CourseSchedule : {}", id);
        courseScheduleService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
