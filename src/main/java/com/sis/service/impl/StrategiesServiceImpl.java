package com.sis.service.impl;

import com.sis.domain.Strategies;
import com.sis.repository.StrategiesRepository;
import com.sis.service.StrategiesService;
import com.sis.service.dto.StrategiesDTO;
import com.sis.service.mapper.StrategiesMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Strategies}.
 */
@Service
@Transactional
public class StrategiesServiceImpl implements StrategiesService {

    private final Logger log = LoggerFactory.getLogger(StrategiesServiceImpl.class);

    private final StrategiesRepository strategiesRepository;

    private final StrategiesMapper strategiesMapper;

    public StrategiesServiceImpl(StrategiesRepository strategiesRepository, StrategiesMapper strategiesMapper) {
        this.strategiesRepository = strategiesRepository;
        this.strategiesMapper = strategiesMapper;
    }

    @Override
    public StrategiesDTO save(StrategiesDTO strategiesDTO) {
        log.debug("Request to save Strategies : {}", strategiesDTO);
        Strategies strategies = strategiesMapper.toEntity(strategiesDTO);
        strategies = strategiesRepository.save(strategies);
        return strategiesMapper.toDto(strategies);
    }

    @Override
    public StrategiesDTO update(StrategiesDTO strategiesDTO) {
        log.debug("Request to update Strategies : {}", strategiesDTO);
        Strategies strategies = strategiesMapper.toEntity(strategiesDTO);
        strategies = strategiesRepository.save(strategies);
        return strategiesMapper.toDto(strategies);
    }

    @Override
    public Optional<StrategiesDTO> partialUpdate(StrategiesDTO strategiesDTO) {
        log.debug("Request to partially update Strategies : {}", strategiesDTO);

        return strategiesRepository
            .findById(strategiesDTO.getId())
            .map(existingStrategies -> {
                strategiesMapper.partialUpdate(existingStrategies, strategiesDTO);

                return existingStrategies;
            })
            .map(strategiesRepository::save)
            .map(strategiesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StrategiesDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Strategies");
        return strategiesRepository.findAll(pageable).map(strategiesMapper::toDto);
    }

    public Page<StrategiesDTO> findAllWithEagerRelationships(Pageable pageable) {
        return strategiesRepository.findAllWithEagerRelationships(pageable).map(strategiesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<StrategiesDTO> findOne(Long id) {
        log.debug("Request to get Strategies : {}", id);
        return strategiesRepository.findOneWithEagerRelationships(id).map(strategiesMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Strategies : {}", id);
        strategiesRepository.deleteById(id);
    }
}
