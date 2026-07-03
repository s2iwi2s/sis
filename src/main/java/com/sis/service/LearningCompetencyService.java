package com.sis.service;

import com.sis.service.dto.LearningCompetencyDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.LearningCompetency}.
 */
public interface LearningCompetencyService {
    /**
     * Save a learningCompetency.
     *
     * @param learningCompetencyDTO the entity to save.
     * @return the persisted entity.
     */
    LearningCompetencyDTO save(LearningCompetencyDTO learningCompetencyDTO);

    /**
     * Updates a learningCompetency.
     *
     * @param learningCompetencyDTO the entity to update.
     * @return the persisted entity.
     */
    LearningCompetencyDTO update(LearningCompetencyDTO learningCompetencyDTO);

    /**
     * Partially updates a learningCompetency.
     *
     * @param learningCompetencyDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LearningCompetencyDTO> partialUpdate(LearningCompetencyDTO learningCompetencyDTO);

    /**
     * Get all the learningCompetencies.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<LearningCompetencyDTO> findAll(Pageable pageable);

    /**
     * Get the "id" learningCompetency.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LearningCompetencyDTO> findOne(Long id);

    /**
     * Delete the "id" learningCompetency.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
