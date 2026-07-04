package com.sis.service.impl;

import com.sis.domain.LearningCompetency;
import com.sis.repository.LearningCompetencyRepository;
import com.sis.service.LearningCompetencyService;
import com.sis.service.dto.LearningCompetencyDTO;
import com.sis.service.mapper.LearningCompetencyMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.LearningCompetency}.
 */
@Service
@Transactional
public class LearningCompetencyServiceImpl implements LearningCompetencyService {

    private static final Logger LOG = LoggerFactory.getLogger(LearningCompetencyServiceImpl.class);

    private final LearningCompetencyRepository learningCompetencyRepository;

    private final LearningCompetencyMapper learningCompetencyMapper;

    public LearningCompetencyServiceImpl(
        LearningCompetencyRepository learningCompetencyRepository,
        LearningCompetencyMapper learningCompetencyMapper
    ) {
        this.learningCompetencyRepository = learningCompetencyRepository;
        this.learningCompetencyMapper = learningCompetencyMapper;
    }

    @Override
    public LearningCompetencyDTO save(LearningCompetencyDTO learningCompetencyDTO) {
        LOG.debug("Request to save LearningCompetency : {}", learningCompetencyDTO);
        LearningCompetency learningCompetency = learningCompetencyMapper.toEntity(learningCompetencyDTO);
        learningCompetency = learningCompetencyRepository.save(learningCompetency);
        return learningCompetencyMapper.toDto(learningCompetency);
    }

    @Override
    public LearningCompetencyDTO update(LearningCompetencyDTO learningCompetencyDTO) {
        LOG.debug("Request to update LearningCompetency : {}", learningCompetencyDTO);
        LearningCompetency learningCompetency = learningCompetencyMapper.toEntity(learningCompetencyDTO);
        learningCompetency = learningCompetencyRepository.save(learningCompetency);
        return learningCompetencyMapper.toDto(learningCompetency);
    }

    @Override
    public Optional<LearningCompetencyDTO> partialUpdate(LearningCompetencyDTO learningCompetencyDTO) {
        LOG.debug("Request to partially update LearningCompetency : {}", learningCompetencyDTO);

        return learningCompetencyRepository
            .findById(learningCompetencyDTO.getId())
            .map(existingLearningCompetency -> {
                learningCompetencyMapper.partialUpdate(existingLearningCompetency, learningCompetencyDTO);

                return existingLearningCompetency;
            })
            .map(learningCompetencyRepository::save)
            .map(learningCompetencyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LearningCompetencyDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all LearningCompetencies");
        return learningCompetencyRepository.findAll(pageable).map(learningCompetencyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LearningCompetencyDTO> findOne(Long id) {
        LOG.debug("Request to get LearningCompetency : {}", id);
        return learningCompetencyRepository.findById(id).map(learningCompetencyMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete LearningCompetency : {}", id);
        learningCompetencyRepository.deleteById(id);
    }
}
