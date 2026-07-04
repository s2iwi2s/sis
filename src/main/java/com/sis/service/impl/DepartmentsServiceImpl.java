package com.sis.service.impl;

import com.sis.domain.Departments;
import com.sis.repository.DepartmentsRepository;
import com.sis.service.DepartmentsService;
import com.sis.service.dto.DepartmentsDTO;
import com.sis.service.mapper.DepartmentsMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Departments}.
 */
@Service
@Transactional
public class DepartmentsServiceImpl implements DepartmentsService {

    private static final Logger LOG = LoggerFactory.getLogger(DepartmentsServiceImpl.class);

    private final DepartmentsRepository departmentsRepository;

    private final DepartmentsMapper departmentsMapper;

    public DepartmentsServiceImpl(DepartmentsRepository departmentsRepository, DepartmentsMapper departmentsMapper) {
        this.departmentsRepository = departmentsRepository;
        this.departmentsMapper = departmentsMapper;
    }

    @Override
    public DepartmentsDTO save(DepartmentsDTO departmentsDTO) {
        LOG.debug("Request to save Departments : {}", departmentsDTO);
        Departments departments = departmentsMapper.toEntity(departmentsDTO);
        departments = departmentsRepository.save(departments);
        return departmentsMapper.toDto(departments);
    }

    @Override
    public DepartmentsDTO update(DepartmentsDTO departmentsDTO) {
        LOG.debug("Request to update Departments : {}", departmentsDTO);
        Departments departments = departmentsMapper.toEntity(departmentsDTO);
        departments = departmentsRepository.save(departments);
        return departmentsMapper.toDto(departments);
    }

    @Override
    public Optional<DepartmentsDTO> partialUpdate(DepartmentsDTO departmentsDTO) {
        LOG.debug("Request to partially update Departments : {}", departmentsDTO);

        return departmentsRepository
            .findById(departmentsDTO.getId())
            .map(existingDepartments -> {
                departmentsMapper.partialUpdate(existingDepartments, departmentsDTO);

                return existingDepartments;
            })
            .map(departmentsRepository::save)
            .map(departmentsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DepartmentsDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Departmentses");
        return departmentsRepository.findAll(pageable).map(departmentsMapper::toDto);
    }

    /**
     *  Get all the departmentses where Course is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<DepartmentsDTO> findAllWhereCourseIsNull() {
        LOG.debug("Request to get all departmentses where Course is null");
        return StreamSupport.stream(departmentsRepository.findAll().spliterator(), false)
            .filter(departments -> departments.getCourse() == null)
            .map(departmentsMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DepartmentsDTO> findOne(Long id) {
        LOG.debug("Request to get Departments : {}", id);
        return departmentsRepository.findById(id).map(departmentsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Departments : {}", id);
        departmentsRepository.deleteById(id);
    }
}
