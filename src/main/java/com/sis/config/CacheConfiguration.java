package com.sis.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.boot.cache.autoconfigure.JCacheManagerCustomizer;
import org.springframework.boot.hibernate.autoconfigure.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tech.jhipster.config.JHipsterProperties;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        var ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(
                Object.class,
                Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries())
            )
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build()
        );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.sis.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.sis.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.sis.domain.User.class.getName());
            createCache(cm, com.sis.domain.Authority.class.getName());
            createCache(cm, com.sis.domain.User.class.getName() + ".authorities");
            createCache(cm, com.sis.domain.Instructor.class.getName());
            createCache(cm, com.sis.domain.Instructor.class.getName() + ".courseSchedules");
            createCache(cm, com.sis.domain.Student.class.getName());
            createCache(cm, com.sis.domain.Student.class.getName() + ".courseSchedules");
            createCache(cm, com.sis.domain.Course.class.getName());
            createCache(cm, com.sis.domain.Course.class.getName() + ".curriculumMaps");
            createCache(cm, com.sis.domain.CourseSchedule.class.getName());
            createCache(cm, com.sis.domain.CourseSchedule.class.getName() + ".instructors");
            createCache(cm, com.sis.domain.CourseSchedule.class.getName() + ".students");
            createCache(cm, com.sis.domain.Departments.class.getName());
            createCache(cm, com.sis.domain.AppConfig.class.getName());
            createCache(cm, com.sis.domain.CurriculumMap.class.getName());
            createCache(cm, com.sis.domain.CurriculumMap.class.getName() + ".learningCompetencies");
            createCache(cm, com.sis.domain.LearningCompetency.class.getName());
            createCache(cm, com.sis.domain.LearningCompetency.class.getName() + ".strategieses");
            createCache(cm, com.sis.domain.LearningCompetency.class.getName() + ".assessments");
            createCache(cm, com.sis.domain.Strategies.class.getName());
            createCache(cm, com.sis.domain.Strategies.class.getName() + ".resourceses");
            createCache(cm, com.sis.domain.Assessment.class.getName());
            createCache(cm, com.sis.domain.Assessment.class.getName() + ".resourceses");
            createCache(cm, com.sis.domain.Resources.class.getName());
            createCache(cm, com.sis.domain.Resources.class.getName() + ".strategieses");
            createCache(cm, com.sis.domain.Resources.class.getName() + ".assessments");
            createCache(cm, com.sis.domain.AcademicYear.class.getName());
            createCache(cm, com.sis.domain.AcademicTerms.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }
}
