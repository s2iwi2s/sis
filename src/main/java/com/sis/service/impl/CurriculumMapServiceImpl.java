package com.sis.service.impl;

import com.sis.domain.CurriculumMap;
import com.sis.repository.CurriculumMapRepository;
import com.sis.service.CurriculumMapService;
import com.sis.service.dto.CurriculumMapDTO;
import com.sis.service.mapper.CurriculumMapMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.CurriculumMap}.
 */
@Service
@Transactional
public class CurriculumMapServiceImpl implements CurriculumMapService {

    private final Logger log = LoggerFactory.getLogger(CurriculumMapServiceImpl.class);

    private final CurriculumMapRepository curriculumMapRepository;

    private final CurriculumMapMapper curriculumMapMapper;

    public CurriculumMapServiceImpl(CurriculumMapRepository curriculumMapRepository, CurriculumMapMapper curriculumMapMapper) {
        this.curriculumMapRepository = curriculumMapRepository;
        this.curriculumMapMapper = curriculumMapMapper;
    }

    @Override
    public CurriculumMapDTO save(CurriculumMapDTO curriculumMapDTO) {
        log.debug("Request to save CurriculumMap : {}", curriculumMapDTO);
        CurriculumMap curriculumMap = curriculumMapMapper.toEntity(curriculumMapDTO);
        curriculumMap = curriculumMapRepository.save(curriculumMap);
        return curriculumMapMapper.toDto(curriculumMap);
    }

    @Override
    public CurriculumMapDTO update(CurriculumMapDTO curriculumMapDTO) {
        log.debug("Request to update CurriculumMap : {}", curriculumMapDTO);
        CurriculumMap curriculumMap = curriculumMapMapper.toEntity(curriculumMapDTO);
        curriculumMap = curriculumMapRepository.save(curriculumMap);
        return curriculumMapMapper.toDto(curriculumMap);
    }

    @Override
    public Optional<CurriculumMapDTO> partialUpdate(CurriculumMapDTO curriculumMapDTO) {
        log.debug("Request to partially update CurriculumMap : {}", curriculumMapDTO);

        return curriculumMapRepository
            .findById(curriculumMapDTO.getId())
            .map(existingCurriculumMap -> {
                curriculumMapMapper.partialUpdate(existingCurriculumMap, curriculumMapDTO);

                return existingCurriculumMap;
            })
            .map(curriculumMapRepository::save)
            .map(curriculumMapMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CurriculumMapDTO> findAll(Pageable pageable) {
        log.debug("Request to get all CurriculumMaps");
        return curriculumMapRepository.findAll(pageable).map(curriculumMapMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CurriculumMapDTO> findOne(Long id) {
        log.debug("Request to get CurriculumMap : {}", id);
        return curriculumMapRepository.findById(id).map(curriculumMapMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CurriculumMap : {}", id);
        curriculumMapRepository.deleteById(id);
    }
}
