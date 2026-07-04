package com.sis.web.rest;

import com.sis.repository.DepartmentsRepository;
import com.sis.service.DepartmentsService;
import com.sis.service.dto.DepartmentsDTO;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.sis.domain.Departments}.
 */
@RestController
@RequestMapping("/api/departments")
public class DepartmentsResource {

    private static final Logger LOG = LoggerFactory.getLogger(DepartmentsResource.class);

    private static final String ENTITY_NAME = "departments";

    @Value("${jhipster.clientApp.name:schInfoSys}")
    private String applicationName;

    private final DepartmentsService departmentsService;

    private final DepartmentsRepository departmentsRepository;

    public DepartmentsResource(DepartmentsService departmentsService, DepartmentsRepository departmentsRepository) {
        this.departmentsService = departmentsService;
        this.departmentsRepository = departmentsRepository;
    }

    /**
     * {@code POST  /departments} : Create a new departments.
     *
     * @param departmentsDTO the departmentsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new departmentsDTO, or with status {@code 400 (Bad Request)} if the departments has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<DepartmentsDTO> createDepartments(@Valid @RequestBody DepartmentsDTO departmentsDTO) throws URISyntaxException {
        LOG.debug("REST request to save Departments : {}", departmentsDTO);
        if (departmentsDTO.getId() != null) {
            throw new BadRequestAlertException("A new departments cannot already have an ID", ENTITY_NAME, "idexists");
        }
        departmentsDTO = departmentsService.save(departmentsDTO);
        return ResponseEntity.created(new URI("/api/departments/" + departmentsDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, departmentsDTO.getId().toString()))
            .body(departmentsDTO);
    }

    /**
     * {@code PUT  /departments/:id} : Updates an existing departments.
     *
     * @param id the id of the departmentsDTO to save.
     * @param departmentsDTO the departmentsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated departmentsDTO,
     * or with status {@code 400 (Bad Request)} if the departmentsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the departmentsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentsDTO> updateDepartments(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DepartmentsDTO departmentsDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Departments : {}, {}", id, departmentsDTO);
        if (departmentsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, departmentsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!departmentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        departmentsDTO = departmentsService.update(departmentsDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, departmentsDTO.getId().toString()))
            .body(departmentsDTO);
    }

    /**
     * {@code PATCH  /departments/:id} : Partial updates given fields of an existing departments, field will ignore if it is null
     *
     * @param id the id of the departmentsDTO to save.
     * @param departmentsDTO the departmentsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated departmentsDTO,
     * or with status {@code 400 (Bad Request)} if the departmentsDTO is not valid,
     * or with status {@code 404 (Not Found)} if the departmentsDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the departmentsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DepartmentsDTO> partialUpdateDepartments(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DepartmentsDTO departmentsDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Departments partially : {}, {}", id, departmentsDTO);
        if (departmentsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, departmentsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!departmentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DepartmentsDTO> result = departmentsService.partialUpdate(departmentsDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, departmentsDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /departments} : get all the Departments.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Departments in body.
     */
    @GetMapping("")
    public ResponseEntity<List<DepartmentsDTO>> getAllDepartmentses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("course-is-null".equals(filter)) {
            LOG.debug("REST request to get all Departmentss where course is null");
            return new ResponseEntity<>(departmentsService.findAllWhereCourseIsNull(), HttpStatus.OK);
        }
        LOG.debug("REST request to get a page of Departmentses");
        Page<DepartmentsDTO> page = departmentsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /departments/:id} : get the "id" departments.
     *
     * @param id the id of the departmentsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the departmentsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentsDTO> getDepartments(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Departments : {}", id);
        Optional<DepartmentsDTO> departmentsDTO = departmentsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(departmentsDTO);
    }

    /**
     * {@code DELETE  /departments/:id} : delete the "id" departments.
     *
     * @param id the id of the departmentsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartments(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Departments : {}", id);
        departmentsService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
