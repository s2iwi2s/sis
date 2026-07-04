package com.sis.service;

import com.sis.service.dto.DepartmentsDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.Departments}.
 */
public interface DepartmentsService {
    /**
     * Save a departments.
     *
     * @param departmentsDTO the entity to save.
     * @return the persisted entity.
     */
    DepartmentsDTO save(DepartmentsDTO departmentsDTO);

    /**
     * Updates a departments.
     *
     * @param departmentsDTO the entity to update.
     * @return the persisted entity.
     */
    DepartmentsDTO update(DepartmentsDTO departmentsDTO);

    /**
     * Partially updates a departments.
     *
     * @param departmentsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DepartmentsDTO> partialUpdate(DepartmentsDTO departmentsDTO);

    /**
     * Get all the departmentses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DepartmentsDTO> findAll(Pageable pageable);

    /**
     * Get all the DepartmentsDTO where Course is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<DepartmentsDTO> findAllWhereCourseIsNull();

    /**
     * Get the "id" departments.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DepartmentsDTO> findOne(Long id);

    /**
     * Delete the "id" departments.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
