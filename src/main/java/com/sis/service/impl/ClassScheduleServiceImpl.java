package com.sis.service.impl;

import com.sis.domain.ClassSchedule;
import com.sis.repository.ClassScheduleRepository;
import com.sis.service.ClassScheduleService;
import com.sis.service.dto.ClassScheduleDTO;
import com.sis.service.mapper.ClassScheduleMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.ClassSchedule}.
 */
@Service
@Transactional
public class ClassScheduleServiceImpl implements ClassScheduleService {

    private static final Logger LOG = LoggerFactory.getLogger(ClassScheduleServiceImpl.class);

    private final ClassScheduleRepository classScheduleRepository;

    private final ClassScheduleMapper classScheduleMapper;

    public ClassScheduleServiceImpl(ClassScheduleRepository classScheduleRepository, ClassScheduleMapper classScheduleMapper) {
        this.classScheduleRepository = classScheduleRepository;
        this.classScheduleMapper = classScheduleMapper;
    }

    @Override
    public ClassScheduleDTO save(ClassScheduleDTO classScheduleDTO) {
        LOG.debug("Request to save ClassSchedule : {}", classScheduleDTO);
        ClassSchedule classSchedule = classScheduleMapper.toEntity(classScheduleDTO);
        classSchedule = classScheduleRepository.save(classSchedule);
        return classScheduleMapper.toDto(classSchedule);
    }

    @Override
    public ClassScheduleDTO update(ClassScheduleDTO classScheduleDTO) {
        LOG.debug("Request to update ClassSchedule : {}", classScheduleDTO);
        ClassSchedule classSchedule = classScheduleMapper.toEntity(classScheduleDTO);
        classSchedule = classScheduleRepository.save(classSchedule);
        return classScheduleMapper.toDto(classSchedule);
    }

    @Override
    public Optional<ClassScheduleDTO> partialUpdate(ClassScheduleDTO classScheduleDTO) {
        LOG.debug("Request to partially update ClassSchedule : {}", classScheduleDTO);

        return classScheduleRepository
            .findById(classScheduleDTO.getId())
            .map(existingClassSchedule -> {
                classScheduleMapper.partialUpdate(existingClassSchedule, classScheduleDTO);

                return existingClassSchedule;
            })
            .map(classScheduleRepository::save)
            .map(classScheduleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassScheduleDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ClassSchedules");
        return classScheduleRepository.findAll(pageable).map(classScheduleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ClassScheduleDTO> findOne(Long id) {
        LOG.debug("Request to get ClassSchedule : {}", id);
        return classScheduleRepository.findById(id).map(classScheduleMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete ClassSchedule : {}", id);
        classScheduleRepository.deleteById(id);
    }
}
