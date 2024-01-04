package com.sis.web.rest;

import com.sis.repository.ResourcesRepository;
import com.sis.service.ResourcesService;
import com.sis.service.dto.ResourcesDTO;
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
 * REST controller for managing {@link com.sis.domain.Resources}.
 */
@RestController
@RequestMapping("/api/resources")
public class ResourcesResource {

    private final Logger log = LoggerFactory.getLogger(ResourcesResource.class);

    private static final String ENTITY_NAME = "resources";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResourcesService resourcesService;

    private final ResourcesRepository resourcesRepository;

    public ResourcesResource(ResourcesService resourcesService, ResourcesRepository resourcesRepository) {
        this.resourcesService = resourcesService;
        this.resourcesRepository = resourcesRepository;
    }

    /**
     * {@code POST  /resources} : Create a new resources.
     *
     * @param resourcesDTO the resourcesDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resourcesDTO, or with status {@code 400 (Bad Request)} if the resources has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ResourcesDTO> createResources(@Valid @RequestBody ResourcesDTO resourcesDTO) throws URISyntaxException {
        log.debug("REST request to save Resources : {}", resourcesDTO);
        if (resourcesDTO.getId() != null) {
            throw new BadRequestAlertException("A new resources cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ResourcesDTO result = resourcesService.save(resourcesDTO);
        return ResponseEntity
            .created(new URI("/api/resources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /resources/:id} : Updates an existing resources.
     *
     * @param id the id of the resourcesDTO to save.
     * @param resourcesDTO the resourcesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourcesDTO,
     * or with status {@code 400 (Bad Request)} if the resourcesDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resourcesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourcesDTO> updateResources(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ResourcesDTO resourcesDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Resources : {}, {}", id, resourcesDTO);
        if (resourcesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourcesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourcesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ResourcesDTO result = resourcesService.update(resourcesDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourcesDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /resources/:id} : Partial updates given fields of an existing resources, field will ignore if it is null
     *
     * @param id the id of the resourcesDTO to save.
     * @param resourcesDTO the resourcesDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourcesDTO,
     * or with status {@code 400 (Bad Request)} if the resourcesDTO is not valid,
     * or with status {@code 404 (Not Found)} if the resourcesDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the resourcesDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ResourcesDTO> partialUpdateResources(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ResourcesDTO resourcesDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Resources partially : {}, {}", id, resourcesDTO);
        if (resourcesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourcesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourcesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ResourcesDTO> result = resourcesService.partialUpdate(resourcesDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourcesDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /resources} : get all the resources.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resources in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ResourcesDTO>> getAllResources(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Resources");
        Page<ResourcesDTO> page = resourcesService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /resources/:id} : get the "id" resources.
     *
     * @param id the id of the resourcesDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resourcesDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourcesDTO> getResources(@PathVariable("id") Long id) {
        log.debug("REST request to get Resources : {}", id);
        Optional<ResourcesDTO> resourcesDTO = resourcesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(resourcesDTO);
    }

    /**
     * {@code DELETE  /resources/:id} : delete the "id" resources.
     *
     * @param id the id of the resourcesDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResources(@PathVariable("id") Long id) {
        log.debug("REST request to delete Resources : {}", id);
        resourcesService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
