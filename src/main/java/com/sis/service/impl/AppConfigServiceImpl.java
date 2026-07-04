package com.sis.service.impl;

import com.sis.domain.AppConfig;
import com.sis.repository.AppConfigRepository;
import com.sis.service.AppConfigService;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.mapper.AppConfigMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.AppConfig}.
 */
@Service
@Transactional
public class AppConfigServiceImpl implements AppConfigService {

    private static final Logger LOG = LoggerFactory.getLogger(AppConfigServiceImpl.class);

    private final AppConfigRepository appConfigRepository;

    private final AppConfigMapper appConfigMapper;

    public AppConfigServiceImpl(AppConfigRepository appConfigRepository, AppConfigMapper appConfigMapper) {
        this.appConfigRepository = appConfigRepository;
        this.appConfigMapper = appConfigMapper;
    }

    @Override
    public AppConfigDTO save(AppConfigDTO appConfigDTO) {
        LOG.debug("Request to save AppConfig : {}", appConfigDTO);
        AppConfig appConfig = appConfigMapper.toEntity(appConfigDTO);
        appConfig = appConfigRepository.save(appConfig);
        return appConfigMapper.toDto(appConfig);
    }

    @Override
    public AppConfigDTO update(AppConfigDTO appConfigDTO) {
        LOG.debug("Request to update AppConfig : {}", appConfigDTO);
        AppConfig appConfig = appConfigMapper.toEntity(appConfigDTO);
        appConfig = appConfigRepository.save(appConfig);
        return appConfigMapper.toDto(appConfig);
    }

    @Override
    public Optional<AppConfigDTO> partialUpdate(AppConfigDTO appConfigDTO) {
        LOG.debug("Request to partially update AppConfig : {}", appConfigDTO);

        return appConfigRepository
            .findById(appConfigDTO.getId())
            .map(existingAppConfig -> {
                appConfigMapper.partialUpdate(existingAppConfig, appConfigDTO);

                return existingAppConfig;
            })
            .map(appConfigRepository::save)
            .map(appConfigMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppConfigDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AppConfigs");
        return appConfigRepository.findAll(pageable).map(appConfigMapper::toDto);
    }

    /**
     *  Get all the appConfigs where Instructor is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<AppConfigDTO> findAllWhereInstructorIsNull() {
        LOG.debug("Request to get all appConfigs where Instructor is null");
        return StreamSupport.stream(appConfigRepository.findAll().spliterator(), false)
            .filter(appConfig -> appConfig.getInstructor() == null)
            .map(appConfigMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the appConfigs where Student is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<AppConfigDTO> findAllWhereStudentIsNull() {
        LOG.debug("Request to get all appConfigs where Student is null");
        return StreamSupport.stream(appConfigRepository.findAll().spliterator(), false)
            .filter(appConfig -> appConfig.getStudent() == null)
            .map(appConfigMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the appConfigs where Course is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<AppConfigDTO> findAllWhereCourseIsNull() {
        LOG.debug("Request to get all appConfigs where Course is null");
        return StreamSupport.stream(appConfigRepository.findAll().spliterator(), false)
            .filter(appConfig -> appConfig.getCourse() == null)
            .map(appConfigMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppConfigDTO> findOne(Long id) {
        LOG.debug("Request to get AppConfig : {}", id);
        return appConfigRepository.findById(id).map(appConfigMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete AppConfig : {}", id);
        appConfigRepository.deleteById(id);
    }
}
