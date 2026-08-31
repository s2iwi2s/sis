package com.sis.service;

import com.sis.service.dto.ClassScheduleDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.ClassSchedule}.
 */
public interface ClassScheduleService {
    /**
     * Save a classSchedule.
     *
     * @param classScheduleDTO the entity to save.
     * @return the persisted entity.
     */
    ClassScheduleDTO save(ClassScheduleDTO classScheduleDTO);

    /**
     * Updates a classSchedule.
     *
     * @param classScheduleDTO the entity to update.
     * @return the persisted entity.
     */
    ClassScheduleDTO update(ClassScheduleDTO classScheduleDTO);

    /**
     * Partially updates a classSchedule.
     *
     * @param classScheduleDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ClassScheduleDTO> partialUpdate(ClassScheduleDTO classScheduleDTO);

    /**
     * Get all the classSchedules.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ClassScheduleDTO> findAll(Pageable pageable);

    /**
     * Get the "id" classSchedule.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ClassScheduleDTO> findOne(Long id);

    /**
     * Delete the "id" classSchedule.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
