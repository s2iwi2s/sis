package com.sis.repository;

import com.sis.domain.Instructor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface InstructorRepositoryWithBagRelationships {
    Optional<Instructor> fetchBagRelationships(Optional<Instructor> instructor);

    List<Instructor> fetchBagRelationships(List<Instructor> instructors);

    Page<Instructor> fetchBagRelationships(Page<Instructor> instructors);
}
