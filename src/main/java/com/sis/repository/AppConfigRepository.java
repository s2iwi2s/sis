package com.sis.repository;

import com.sis.domain.AppConfig;
import java.util.List;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AppConfig entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppConfigRepository extends JpaRepository<AppConfig, Long> {
    List<AppConfig> findAllByCodeOrderByPriorityAscValueAsc(String code);
}
