package com.sis.service;

import com.sis.service.dto.CurriculumMapDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.CurriculumMap}.
 */
public interface CurriculumMapService {
    /**
     * Save a curriculumMap.
     *
     * @param curriculumMapDTO the entity to save.
     * @return the persisted entity.
     */
    CurriculumMapDTO save(CurriculumMapDTO curriculumMapDTO);

    /**
     * Updates a curriculumMap.
     *
     * @param curriculumMapDTO the entity to update.
     * @return the persisted entity.
     */
    CurriculumMapDTO update(CurriculumMapDTO curriculumMapDTO);

    /**
     * Partially updates a curriculumMap.
     *
     * @param curriculumMapDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CurriculumMapDTO> partialUpdate(CurriculumMapDTO curriculumMapDTO);

    /**
     * Get all the curriculumMaps.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CurriculumMapDTO> findAll(Pageable pageable);

    /**
     * Get the "id" curriculumMap.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CurriculumMapDTO> findOne(Long id);

    /**
     * Delete the "id" curriculumMap.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
