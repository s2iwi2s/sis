package com.sis.repository;

import com.sis.domain.Assessment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface AssessmentRepositoryWithBagRelationships {
    Optional<Assessment> fetchBagRelationships(Optional<Assessment> assessment);

    List<Assessment> fetchBagRelationships(List<Assessment> assessments);

    Page<Assessment> fetchBagRelationships(Page<Assessment> assessments);
}
