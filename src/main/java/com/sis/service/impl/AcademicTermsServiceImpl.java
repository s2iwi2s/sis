package com.sis.service.impl;

import com.sis.domain.AcademicTerms;
import com.sis.repository.AcademicTermsRepository;
import com.sis.service.AcademicTermsService;
import com.sis.service.dto.AcademicTermsDTO;
import com.sis.service.mapper.AcademicTermsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.AcademicTerms}.
 */
@Service
@Transactional
public class AcademicTermsServiceImpl implements AcademicTermsService {

    private static final Logger LOG = LoggerFactory.getLogger(AcademicTermsServiceImpl.class);

    private final AcademicTermsRepository academicTermsRepository;

    private final AcademicTermsMapper academicTermsMapper;

    public AcademicTermsServiceImpl(AcademicTermsRepository academicTermsRepository, AcademicTermsMapper academicTermsMapper) {
        this.academicTermsRepository = academicTermsRepository;
        this.academicTermsMapper = academicTermsMapper;
    }

    @Override
    public AcademicTermsDTO save(AcademicTermsDTO academicTermsDTO) {
        LOG.debug("Request to save AcademicTerms : {}", academicTermsDTO);
        AcademicTerms academicTerms = academicTermsMapper.toEntity(academicTermsDTO);
        academicTerms = academicTermsRepository.save(academicTerms);
        return academicTermsMapper.toDto(academicTerms);
    }

    @Override
    public AcademicTermsDTO update(AcademicTermsDTO academicTermsDTO) {
        LOG.debug("Request to update AcademicTerms : {}", academicTermsDTO);
        AcademicTerms academicTerms = academicTermsMapper.toEntity(academicTermsDTO);
        academicTerms = academicTermsRepository.save(academicTerms);
        return academicTermsMapper.toDto(academicTerms);
    }

    @Override
    public Optional<AcademicTermsDTO> partialUpdate(AcademicTermsDTO academicTermsDTO) {
        LOG.debug("Request to partially update AcademicTerms : {}", academicTermsDTO);

        return academicTermsRepository
            .findById(academicTermsDTO.getId())
            .map(existingAcademicTerms -> {
                academicTermsMapper.partialUpdate(existingAcademicTerms, academicTermsDTO);

                return existingAcademicTerms;
            })
            .map(academicTermsRepository::save)
            .map(academicTermsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AcademicTermsDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AcademicTermses");
        return academicTermsRepository.findAll(pageable).map(academicTermsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AcademicTermsDTO> findOne(Long id) {
        LOG.debug("Request to get AcademicTerms : {}", id);
        return academicTermsRepository.findById(id).map(academicTermsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete AcademicTerms : {}", id);
        academicTermsRepository.deleteById(id);
    }
}
