package com.sis.service.impl;

import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.exact;
import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.startsWith;
import static org.springframework.data.domain.ExampleMatcher.matching;

import com.sis.domain.Student;
import com.sis.repository.StudentRepository;
import com.sis.service.StudentService;
import com.sis.service.dto.StudentDTO;
import com.sis.service.mapper.StudentMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Student}.
 */
@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private static final Logger LOG = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final StudentRepository studentRepository;

    private final StudentMapper studentMapper;

    public StudentServiceImpl(StudentRepository studentRepository, StudentMapper studentMapper) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
    }

    @Override
    public StudentDTO save(StudentDTO studentDTO) {
        LOG.debug("Request to save Student : {}", studentDTO);
        Student student = studentMapper.toEntity(studentDTO);
        student = studentRepository.save(student);
        return studentMapper.toDto(student);
    }

    @Override
    public StudentDTO update(StudentDTO studentDTO) {
        LOG.debug("Request to update Student : {}", studentDTO);
        Student student = studentMapper.toEntity(studentDTO);
        student = studentRepository.save(student);
        return studentMapper.toDto(student);
    }

    @Override
    public Optional<StudentDTO> partialUpdate(StudentDTO studentDTO) {
        LOG.debug("Request to partially update Student : {}", studentDTO);

        return studentRepository
            .findById(studentDTO.getId())
            .map(existingStudent -> {
                studentMapper.partialUpdate(existingStudent, studentDTO);

                return existingStudent;
            })
            .map(studentRepository::save)
            .map(studentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentDTO> findAll(StudentDTO studentDTO, Pageable pageable) {
        LOG.debug("Request to get all Students");
        ExampleMatcher matcher = matching()
            .withIgnoreNullValues()
            .withIgnoreCase()
            .withMatcher("lrn", startsWith())
            .withMatcher("firstName", startsWith())
            .withMatcher("lastName", startsWith())
            .withMatcher("birthDate", exact());
        Example<Student> studentExample = Example.of(studentMapper.toEntity(studentDTO), matcher);
        return studentRepository.findAll(studentExample, pageable).map(studentMapper::toDto);
    }

    public Page<StudentDTO> findAllWithEagerRelationships(StudentDTO studentDTO, Pageable pageable) {
        ExampleMatcher matcher = matching()
            .withIgnoreNullValues()
            .withIgnoreCase()
            .withMatcher("lrn", startsWith())
            .withMatcher("firstName", startsWith())
            .withMatcher("lastName", startsWith())
            .withMatcher("birthDate", exact());
        Example<Student> studentExample = Example.of(studentMapper.toEntity(studentDTO), matcher);
        return studentRepository.findAllWithEagerRelationships(studentExample, pageable).map(studentMapper::toDto);
    }

    public Page<StudentDTO> findAllWithEagerRelationships(Pageable pageable) {
        return studentRepository.findAllWithEagerRelationships(pageable).map(studentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<StudentDTO> findOne(Long id) {
        LOG.debug("Request to get Student : {}", id);
        return studentRepository.findOneWithEagerRelationships(id).map(studentMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Student : {}", id);
        studentRepository.deleteById(id);
    }
}
