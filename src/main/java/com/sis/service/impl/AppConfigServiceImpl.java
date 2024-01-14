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
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
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

    private final Logger log = LoggerFactory.getLogger(AppConfigServiceImpl.class);

    private final AppConfigRepository appConfigRepository;

    private final AppConfigMapper appConfigMapper;

    public AppConfigServiceImpl(AppConfigRepository appConfigRepository, AppConfigMapper appConfigMapper) {
        this.appConfigRepository = appConfigRepository;
        this.appConfigMapper = appConfigMapper;
    }

    @Override
    public AppConfigDTO save(AppConfigDTO appConfigDTO) {
        log.debug("Request to save AppConfig : {}", appConfigDTO);
        AppConfig appConfig = appConfigMapper.toEntity(appConfigDTO);
        appConfig = appConfigRepository.save(appConfig);
        return appConfigMapper.toDto(appConfig);
    }

    @Override
    public AppConfigDTO update(AppConfigDTO appConfigDTO) {
        log.debug("Request to update AppConfig : {}", appConfigDTO);
        AppConfig appConfig = appConfigMapper.toEntity(appConfigDTO);
        appConfig = appConfigRepository.save(appConfig);
        return appConfigMapper.toDto(appConfig);
    }

    @Override
    public Optional<AppConfigDTO> partialUpdate(AppConfigDTO appConfigDTO) {
        log.debug("Request to partially update AppConfig : {}", appConfigDTO);

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
    public Page<AppConfigDTO> findAll(AppConfigDTO filter, Pageable pageable) {
        log.debug("Request to get all AppConfigs");
        Example<AppConfig> example = Example.of(appConfigMapper.toEntity(filter), ExampleMatcher.matchingAll().withIgnoreCase());
        return appConfigRepository.findAll(example, pageable).map(appConfigMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppConfigDTO> findOne(Long id) {
        log.debug("Request to get AppConfig : {}", id);
        return appConfigRepository.findById(id).map(appConfigMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AppConfig : {}", id);
        appConfigRepository.deleteById(id);
    }
}
