package com.sis.service.impl;

import com.sis.domain.AcademicYear;
import com.sis.repository.AcademicYearRepository;
import com.sis.service.AcademicYearService;
import com.sis.service.dto.AcademicYearDTO;
import com.sis.service.mapper.AcademicYearMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.AcademicYear}.
 */
@Service
@Transactional
public class AcademicYearServiceImpl implements AcademicYearService {

    private static final Logger LOG = LoggerFactory.getLogger(AcademicYearServiceImpl.class);

    private final AcademicYearRepository academicYearRepository;

    private final AcademicYearMapper academicYearMapper;

    public AcademicYearServiceImpl(AcademicYearRepository academicYearRepository, AcademicYearMapper academicYearMapper) {
        this.academicYearRepository = academicYearRepository;
        this.academicYearMapper = academicYearMapper;
    }

    @Override
    public AcademicYearDTO save(AcademicYearDTO academicYearDTO) {
        LOG.debug("Request to save AcademicYear : {}", academicYearDTO);
        AcademicYear academicYear = academicYearMapper.toEntity(academicYearDTO);
        academicYear = academicYearRepository.save(academicYear);
        return academicYearMapper.toDto(academicYear);
    }

    @Override
    public AcademicYearDTO update(AcademicYearDTO academicYearDTO) {
        LOG.debug("Request to update AcademicYear : {}", academicYearDTO);
        AcademicYear academicYear = academicYearMapper.toEntity(academicYearDTO);
        academicYear = academicYearRepository.save(academicYear);
        return academicYearMapper.toDto(academicYear);
    }

    @Override
    public Optional<AcademicYearDTO> partialUpdate(AcademicYearDTO academicYearDTO) {
        LOG.debug("Request to partially update AcademicYear : {}", academicYearDTO);

        return academicYearRepository
            .findById(academicYearDTO.getId())
            .map(existingAcademicYear -> {
                academicYearMapper.partialUpdate(existingAcademicYear, academicYearDTO);

                return existingAcademicYear;
            })
            .map(academicYearRepository::save)
            .map(academicYearMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AcademicYearDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AcademicYears");
        return academicYearRepository.findAll(pageable).map(academicYearMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AcademicYearDTO> findOne(Long id) {
        LOG.debug("Request to get AcademicYear : {}", id);
        return academicYearRepository.findById(id).map(academicYearMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete AcademicYear : {}", id);
        academicYearRepository.deleteById(id);
    }
}
