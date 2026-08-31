package com.sis.service.impl;

import com.sis.domain.GradeLevelPayables;
import com.sis.repository.GradeLevelPayablesRepository;
import com.sis.service.GradeLevelPayablesService;
import com.sis.service.dto.GradeLevelPayablesDTO;
import com.sis.service.mapper.GradeLevelPayablesMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.GradeLevelPayables}.
 */
@Service
@Transactional
public class GradeLevelPayablesServiceImpl implements GradeLevelPayablesService {

    private static final Logger LOG = LoggerFactory.getLogger(GradeLevelPayablesServiceImpl.class);

    private final GradeLevelPayablesRepository gradeLevelPayablesRepository;

    private final GradeLevelPayablesMapper gradeLevelPayablesMapper;

    public GradeLevelPayablesServiceImpl(
        GradeLevelPayablesRepository gradeLevelPayablesRepository,
        GradeLevelPayablesMapper gradeLevelPayablesMapper
    ) {
        this.gradeLevelPayablesRepository = gradeLevelPayablesRepository;
        this.gradeLevelPayablesMapper = gradeLevelPayablesMapper;
    }

    @Override
    public GradeLevelPayablesDTO save(GradeLevelPayablesDTO gradeLevelPayablesDTO) {
        LOG.debug("Request to save GradeLevelPayables : {}", gradeLevelPayablesDTO);
        GradeLevelPayables gradeLevelPayables = gradeLevelPayablesMapper.toEntity(gradeLevelPayablesDTO);
        gradeLevelPayables = gradeLevelPayablesRepository.save(gradeLevelPayables);
        return gradeLevelPayablesMapper.toDto(gradeLevelPayables);
    }

    @Override
    public GradeLevelPayablesDTO update(GradeLevelPayablesDTO gradeLevelPayablesDTO) {
        LOG.debug("Request to update GradeLevelPayables : {}", gradeLevelPayablesDTO);
        GradeLevelPayables gradeLevelPayables = gradeLevelPayablesMapper.toEntity(gradeLevelPayablesDTO);
        gradeLevelPayables = gradeLevelPayablesRepository.save(gradeLevelPayables);
        return gradeLevelPayablesMapper.toDto(gradeLevelPayables);
    }

    @Override
    public Optional<GradeLevelPayablesDTO> partialUpdate(GradeLevelPayablesDTO gradeLevelPayablesDTO) {
        LOG.debug("Request to partially update GradeLevelPayables : {}", gradeLevelPayablesDTO);

        return gradeLevelPayablesRepository
            .findById(gradeLevelPayablesDTO.getId())
            .map(existingGradeLevelPayables -> {
                gradeLevelPayablesMapper.partialUpdate(existingGradeLevelPayables, gradeLevelPayablesDTO);

                return existingGradeLevelPayables;
            })
            .map(gradeLevelPayablesRepository::save)
            .map(gradeLevelPayablesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GradeLevelPayablesDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all GradeLevelPayableses");
        return gradeLevelPayablesRepository.findAll(pageable).map(gradeLevelPayablesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GradeLevelPayablesDTO> findOne(Long id) {
        LOG.debug("Request to get GradeLevelPayables : {}", id);
        return gradeLevelPayablesRepository.findById(id).map(gradeLevelPayablesMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete GradeLevelPayables : {}", id);
        gradeLevelPayablesRepository.deleteById(id);
    }
}
