package com.sis.service.impl;

import com.sis.domain.AppConfig;
import com.sis.domain.Assessment;
import com.sis.domain.Resources;
import com.sis.domain.Strategies;
import com.sis.repository.AppConfigRepository;
import com.sis.repository.AssessmentRepository;
import com.sis.repository.ResourcesRepository;
import com.sis.repository.StrategiesRepository;
import com.sis.service.ResourcesService;
import com.sis.service.dto.ResourcesDTO;
import com.sis.service.mapper.ResourcesMapper;
import com.sis.service.util.ImageUtil;
import java.io.IOException;
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

    private static final Logger LOG = LoggerFactory.getLogger(ResourcesServiceImpl.class);

    private final ResourcesRepository resourcesRepository;

    private final ResourcesMapper resourcesMapper;

    private final StrategiesRepository strategiesRepository;

    private final AssessmentRepository assessmentRepository;

    private final AppConfigRepository appConfigRepository;

    public ResourcesServiceImpl(
        ResourcesRepository resourcesRepository,
        ResourcesMapper resourcesMapper,
        StrategiesRepository strategiesRepository,
        AssessmentRepository assessmentRepository,
        AppConfigRepository appConfigRepository
    ) {
        this.resourcesRepository = resourcesRepository;
        this.resourcesMapper = resourcesMapper;
        this.strategiesRepository = strategiesRepository;
        this.assessmentRepository = assessmentRepository;
        this.appConfigRepository = appConfigRepository;
    }

    @Override
    public ResourcesDTO save(ResourcesDTO resourcesDTO) throws IOException {
        LOG.debug("Request to save Resources : {}", resourcesDTO);
        Resources resources = resourcesMapper.toEntity(resourcesDTO);

        String type = resourcesDTO.getDocumentContentType();
        if (type.toLowerCase().contains("image")) {
            toThumbnail(resourcesDTO, resources);
        }

        resources = resourcesRepository.save(resources);
        return resourcesMapper.toDto(resources);
    }

    private void toThumbnail(ResourcesDTO resourcesDTO, Resources resources) throws IOException {
        String[] fileName = resourcesDTO.getFileName().split("\\.");
        String formatName = fileName[fileName.length - 1];
        int height = getHeight();

        if (height != -1) {
            byte[] result = ImageUtil.toThumbnail(resources.getDocument(), formatName, height);
            resources.setDocument(result);
        }
    }

    private int getHeight() {
        int height = -1;
        try {
            Example<AppConfig> example = Example.of(
                new AppConfig().code("IMG_HEIGHT").createdDate(null).lastModifiedDate(null),
                ExampleMatcher.matchingAll().withIgnoreCase()
            );
            List<AppConfig> appConfigs = appConfigRepository.findAll(example);
            if (!appConfigs.isEmpty()) {
                height = Integer.parseInt(appConfigs.get(0).getValue());
            }
        } catch (NumberFormatException e) {
            LOG.error("Unable to find IMG_HEIGHT in appconfig" + e.getMessage(), e);
        }
        return height;
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

        resourcesRepository.findById(id).ifPresent(r -> {
            strategiesRepository.findByResources(r).ifPresent(s -> {
                s.removeResources(r);
                strategiesRepository.save(s);
            });
            assessmentRepository.findByResources(r).ifPresent(a -> {
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

    @Override
    public Set<ResourcesDTO> findResourcesByStrategies(Long strategiesId) {
        Resources resources = new Resources().strategieses(Set.of(new Strategies(strategiesId)));
        Example<Resources> example = Example.of(resources, ExampleMatcher.matchingAll().withIgnoreCase());
        return resourcesRepository.findAll(example).stream().map(resourcesMapper::toDto).collect(Collectors.toSet());
    }
}
