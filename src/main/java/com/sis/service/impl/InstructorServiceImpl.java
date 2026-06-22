package com.sis.service.impl;

import com.sis.domain.Instructor;
import com.sis.repository.InstructorRepository;
import com.sis.service.InstructorService;
import com.sis.service.dto.InstructorDTO;
import com.sis.service.mapper.InstructorMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Instructor}.
 */
@Service
@Transactional
public class InstructorServiceImpl implements InstructorService {

    private final Logger log = LoggerFactory.getLogger(InstructorServiceImpl.class);

    private final InstructorRepository instructorRepository;

    private final InstructorMapper instructorMapper;

    public InstructorServiceImpl(InstructorRepository instructorRepository, InstructorMapper instructorMapper) {
        this.instructorRepository = instructorRepository;
        this.instructorMapper = instructorMapper;
    }

    @Override
    public InstructorDTO save(InstructorDTO instructorDTO) {
        log.debug("Request to save Instructor : {}", instructorDTO);
        Instructor instructor = instructorMapper.toEntity(instructorDTO);
        instructor = instructorRepository.save(instructor);
        return instructorMapper.toDto(instructor);
    }

    @Override
    public InstructorDTO update(InstructorDTO instructorDTO) {
        log.debug("Request to update Instructor : {}", instructorDTO);
        Instructor instructor = instructorMapper.toEntity(instructorDTO);
        instructor = instructorRepository.save(instructor);
        return instructorMapper.toDto(instructor);
    }

    @Override
    public Optional<InstructorDTO> partialUpdate(InstructorDTO instructorDTO) {
        log.debug("Request to partially update Instructor : {}", instructorDTO);

        return instructorRepository
            .findById(instructorDTO.getId())
            .map(existingInstructor -> {
                instructorMapper.partialUpdate(existingInstructor, instructorDTO);

                return existingInstructor;
            })
            .map(instructorRepository::save)
            .map(instructorMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InstructorDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Instructors");
        return instructorRepository.findAll(pageable).map(instructorMapper::toDto);
    }

    public Page<InstructorDTO> findAllWithEagerRelationships(Pageable pageable) {
        return instructorRepository.findAllWithEagerRelationships(pageable).map(instructorMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<InstructorDTO> findOne(Long id) {
        log.debug("Request to get Instructor : {}", id);
        return instructorRepository.findOneWithEagerRelationships(id).map(instructorMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Instructor : {}", id);
        instructorRepository.deleteById(id);
    }
}
