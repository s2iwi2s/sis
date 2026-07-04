package com.sis.service.impl;

import com.sis.domain.CourseSchedule;
import com.sis.repository.CourseScheduleRepository;
import com.sis.service.CourseScheduleService;
import com.sis.service.dto.CourseScheduleDTO;
import com.sis.service.mapper.CourseScheduleMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.CourseSchedule}.
 */
@Service
@Transactional
public class CourseScheduleServiceImpl implements CourseScheduleService {

    private static final Logger LOG = LoggerFactory.getLogger(CourseScheduleServiceImpl.class);

    private final CourseScheduleRepository courseScheduleRepository;

    private final CourseScheduleMapper courseScheduleMapper;

    public CourseScheduleServiceImpl(CourseScheduleRepository courseScheduleRepository, CourseScheduleMapper courseScheduleMapper) {
        this.courseScheduleRepository = courseScheduleRepository;
        this.courseScheduleMapper = courseScheduleMapper;
    }

    @Override
    public CourseScheduleDTO save(CourseScheduleDTO courseScheduleDTO) {
        LOG.debug("Request to save CourseSchedule : {}", courseScheduleDTO);
        CourseSchedule courseSchedule = courseScheduleMapper.toEntity(courseScheduleDTO);
        courseSchedule = courseScheduleRepository.save(courseSchedule);
        return courseScheduleMapper.toDto(courseSchedule);
    }

    @Override
    public CourseScheduleDTO update(CourseScheduleDTO courseScheduleDTO) {
        LOG.debug("Request to update CourseSchedule : {}", courseScheduleDTO);
        CourseSchedule courseSchedule = courseScheduleMapper.toEntity(courseScheduleDTO);
        courseSchedule = courseScheduleRepository.save(courseSchedule);
        return courseScheduleMapper.toDto(courseSchedule);
    }

    @Override
    public Optional<CourseScheduleDTO> partialUpdate(CourseScheduleDTO courseScheduleDTO) {
        LOG.debug("Request to partially update CourseSchedule : {}", courseScheduleDTO);

        return courseScheduleRepository
            .findById(courseScheduleDTO.getId())
            .map(existingCourseSchedule -> {
                courseScheduleMapper.partialUpdate(existingCourseSchedule, courseScheduleDTO);

                return existingCourseSchedule;
            })
            .map(courseScheduleRepository::save)
            .map(courseScheduleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseScheduleDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all CourseSchedules");
        return courseScheduleRepository.findAll(pageable).map(courseScheduleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CourseScheduleDTO> findOne(Long id) {
        LOG.debug("Request to get CourseSchedule : {}", id);
        return courseScheduleRepository.findById(id).map(courseScheduleMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete CourseSchedule : {}", id);
        courseScheduleRepository.deleteById(id);
    }
}
