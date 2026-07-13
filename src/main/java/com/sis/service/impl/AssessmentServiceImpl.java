package com.sis.service.impl;

import com.sis.domain.Assessment;
import com.sis.repository.AssessmentRepository;
import com.sis.service.AssessmentService;
import com.sis.service.dto.AssessmentDTO;
import com.sis.service.mapper.AssessmentMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Assessment}.
 */
@Service
@Transactional
public class AssessmentServiceImpl implements AssessmentService {

    private static final Logger LOG = LoggerFactory.getLogger(AssessmentServiceImpl.class);

    private final AssessmentRepository assessmentRepository;

    private final AssessmentMapper assessmentMapper;

    public AssessmentServiceImpl(AssessmentRepository assessmentRepository, AssessmentMapper assessmentMapper) {
        this.assessmentRepository = assessmentRepository;
        this.assessmentMapper = assessmentMapper;
    }

    @Override
    public AssessmentDTO save(AssessmentDTO assessmentDTO) {
        LOG.debug("Request to save Assessment : {}", assessmentDTO);
        Assessment assessment = assessmentMapper.toEntity(assessmentDTO);
        assessment = assessmentRepository.save(assessment);
        return assessmentMapper.toDto(assessment);
    }

    @Override
    public AssessmentDTO update(AssessmentDTO assessmentDTO) {
        LOG.debug("Request to update Assessment : {}", assessmentDTO);
        Assessment assessment = assessmentMapper.toEntity(assessmentDTO);
        assessment = assessmentRepository.save(assessment);
        return assessmentMapper.toDto(assessment);
    }

    @Override
    public Optional<AssessmentDTO> partialUpdate(AssessmentDTO assessmentDTO) {
        LOG.debug("Request to partially update Assessment : {}", assessmentDTO);

        return assessmentRepository
            .findById(assessmentDTO.getId())
            .map(existingAssessment -> {
                assessmentMapper.partialUpdate(existingAssessment, assessmentDTO);

                return existingAssessment;
            })
            .map(assessmentRepository::save)
            .map(assessmentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssessmentDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Assessments");
        return assessmentRepository.findAll(pageable).map(assessmentMapper::toDto);
    }

    public Page<AssessmentDTO> findAllWithEagerRelationships(Pageable pageable) {
        return assessmentRepository.findAllWithEagerRelationships(pageable).map(assessmentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AssessmentDTO> findOne(Long id) {
        LOG.debug("Request to get Assessment : {}", id);
        return assessmentRepository.findOneWithEagerRelationships(id).map(assessmentMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Assessment : {}", id);
        assessmentRepository.deleteById(id);
    }

    @Override
    public void delete(Long id, Long resourcesId) {
        assessmentRepository.findById(id).ifPresent(a -> this.deleteResource(a, resourcesId));
    }

    @Override
    public List<AssessmentDTO> findAllByCourse(Long courseId) {
        return assessmentRepository.findAllByCourseId(courseId).stream().map(assessmentMapper::toDto).collect(Collectors.toList());
    }

    private void deleteResource(Assessment a, Long resourcesId) {
        Assessment assessment = a.removeResources(resourcesId);
        this.assessmentRepository.save(assessment);
    }
}
