package com.sis.repository;

import com.sis.domain.Student;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentRepositoryWithBagRelationships {
    Optional<Student> fetchBagRelationships(Optional<Student> student);

    List<Student> fetchBagRelationships(List<Student> students);

    Page<Student> fetchBagRelationships(Page<Student> students);
}
