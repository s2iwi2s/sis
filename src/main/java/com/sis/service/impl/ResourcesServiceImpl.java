package com.sis.service.impl;

import com.sis.domain.Assessment;
import com.sis.domain.Resources;
import com.sis.repository.AssessmentRepository;
import com.sis.repository.ResourcesRepository;
import com.sis.repository.StrategiesRepository;
import com.sis.service.ResourcesService;
import com.sis.service.dto.ResourcesDTO;
import com.sis.service.mapper.ResourcesMapper;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
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

    private final Logger log = LoggerFactory.getLogger(ResourcesServiceImpl.class);

    private final ResourcesRepository resourcesRepository;

    private final ResourcesMapper resourcesMapper;

    private final StrategiesRepository strategiesRepository;

    private final AssessmentRepository assessmentRepository;

    public ResourcesServiceImpl(ResourcesRepository resourcesRepository, ResourcesMapper resourcesMapper,
                                StrategiesRepository strategiesRepository,
                                AssessmentRepository assessmentRepository) {
        this.resourcesRepository = resourcesRepository;
        this.resourcesMapper = resourcesMapper;
        this.strategiesRepository = strategiesRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @Override
    public ResourcesDTO save(ResourcesDTO resourcesDTO) {
        log.debug("Request to save Resources : {}", resourcesDTO);
        Resources resources = resourcesMapper.toEntity(resourcesDTO);
        resources = resourcesRepository.save(resources);
        return resourcesMapper.toDto(resources);
    }

    @Override
    public ResourcesDTO update(ResourcesDTO resourcesDTO) {
        log.debug("Request to update Resources : {}", resourcesDTO);
        Resources resources = resourcesMapper.toEntity(resourcesDTO);
        resources = resourcesRepository.save(resources);
        return resourcesMapper.toDto(resources);
    }

    @Override
    public Optional<ResourcesDTO> partialUpdate(ResourcesDTO resourcesDTO) {
        log.debug("Request to partially update Resources : {}", resourcesDTO);

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
        log.debug("Request to get all Resources");
        return resourcesRepository.findAll(pageable).map(resourcesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ResourcesDTO> findOne(Long id) {
        log.debug("Request to get Resources : {}", id);
        return resourcesRepository.findById(id).map(resourcesMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Resources : {}", id);

        resourcesRepository.findById(id)
            .ifPresent(r -> {
                strategiesRepository.findByResources(r)
                    .ifPresent(s -> {
                        s.removeResources(r);
                        strategiesRepository.save(s);
                    });
                assessmentRepository.findByResources(r)
                    .ifPresent(a -> {
                        a.removeResources(r);
                        assessmentRepository.save(a);
                    });
                resourcesRepository.deleteById(id);
            });
    }

    @Override
    public Set<ResourcesDTO> findResourcesByAssessments(Long assessmentId) {
        Resources resources = new Resources().assessments(Set.of(new Assessment(assessmentId)));
        Example<Resources> example = Example.of(resources, ExampleMatcher.matchingAll().withIgnoreCase());
        return resourcesRepository.findAll(example).stream().map(resourcesMapper::toDto).collect(Collectors.toSet());
    }


}
