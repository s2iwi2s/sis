package com.sis.service.impl;

import com.sis.domain.Resources;
import com.sis.repository.ResourcesRepository;
import com.sis.service.ResourcesService;
import com.sis.service.dto.ResourcesDTO;
import com.sis.service.mapper.ResourcesMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Resources}.
 */
@Service
@Transactional
public class ResourcesServiceImpl implements ResourcesService {

    private static final Logger LOG = LoggerFactory.getLogger(ResourcesServiceImpl.class);

    private final ResourcesRepository resourcesRepository;

    private final ResourcesMapper resourcesMapper;

    public ResourcesServiceImpl(ResourcesRepository resourcesRepository, ResourcesMapper resourcesMapper) {
        this.resourcesRepository = resourcesRepository;
        this.resourcesMapper = resourcesMapper;
    }

    @Override
    public ResourcesDTO save(ResourcesDTO resourcesDTO) {
        LOG.debug("Request to save Resources : {}", resourcesDTO);
        Resources resources = resourcesMapper.toEntity(resourcesDTO);
        resources = resourcesRepository.save(resources);
        return resourcesMapper.toDto(resources);
    }

    @Override
    public ResourcesDTO update(ResourcesDTO resourcesDTO) {
        LOG.debug("Request to update Resources : {}", resourcesDTO);
        Resources resources = resourcesMapper.toEntity(resourcesDTO);
        resources = resourcesRepository.save(resources);
        return resourcesMapper.toDto(resources);
    }

    @Override
    public Optional<ResourcesDTO> partialUpdate(ResourcesDTO resourcesDTO) {
        LOG.debug("Request to partially update Resources : {}", resourcesDTO);

        return resourcesRepository
            .findById(resourcesDTO.getId())
            .map(existingResources -> {
                resourcesMapper.partialUpdate(existingResources, resourcesDTO);

                return existingResources;
            })
            .map(resourcesRepository::save)
            .map(resourcesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResourcesDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Resourceses");
        return resourcesRepository.findAll(pageable).map(resourcesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ResourcesDTO> findOne(Long id) {
        LOG.debug("Request to get Resources : {}", id);
        return resourcesRepository.findById(id).map(resourcesMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Resources : {}", id);
        resourcesRepository.deleteById(id);
    }
}
