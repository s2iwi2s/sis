package com.sis.service;

import com.sis.service.dto.CourseScheduleDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.CourseSchedule}.
 */
public interface CourseScheduleService {
    /**
     * Save a courseSchedule.
     *
     * @param courseScheduleDTO the entity to save.
     * @return the persisted entity.
     */
    CourseScheduleDTO save(CourseScheduleDTO courseScheduleDTO);

    /**
     * Updates a courseSchedule.
     *
     * @param courseScheduleDTO the entity to update.
     * @return the persisted entity.
     */
    CourseScheduleDTO update(CourseScheduleDTO courseScheduleDTO);

    /**
     * Partially updates a courseSchedule.
     *
     * @param courseScheduleDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CourseScheduleDTO> partialUpdate(CourseScheduleDTO courseScheduleDTO);

    /**
     * Get all the courseSchedules.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CourseScheduleDTO> findAll(Pageable pageable);

    /**
     * Get the "id" courseSchedule.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CourseScheduleDTO> findOne(Long id);

    /**
     * Delete the "id" courseSchedule.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
