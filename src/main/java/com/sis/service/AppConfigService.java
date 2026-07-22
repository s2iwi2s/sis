package com.sis.service;

import com.sis.service.dto.AppConfigDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.sis.domain.AppConfig}.
 */
public interface AppConfigService {
    /**
     * Save a appConfig.
     *
     * @param appConfigDTO the entity to save.
     * @return the persisted entity.
     */
    AppConfigDTO save(AppConfigDTO appConfigDTO);

    /**
     * Updates a appConfig.
     *
     * @param appConfigDTO the entity to update.
     * @return the persisted entity.
     */
    AppConfigDTO update(AppConfigDTO appConfigDTO);

    /**
     * Partially updates a appConfig.
     *
     * @param appConfigDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AppConfigDTO> partialUpdate(AppConfigDTO appConfigDTO);

    /**
     * Get all the appConfigs.
     * @param appConfigDTO
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AppConfigDTO> findAll(AppConfigDTO appConfigDTO, Pageable pageable);
    /**
     * Get all the appConfigs.
     * @param code the code of the entity
     * @return the list of entities.
     */
    public List<AppConfigDTO> findAllByCode(String code);

    /**
     * Get the "id" appConfig.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AppConfigDTO> findOne(Long id);

    /**
     * Delete the "id" appConfig.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
