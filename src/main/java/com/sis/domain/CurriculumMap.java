package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CurriculumMap.
 */
@Entity
@Table(name = "curriculum_map")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CurriculumMap implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "quarter_no")
    private Integer quarterNo;

    @Column(name = "week_no")
    private Integer weekNo;

    @Column(name = "topic")
    private String topic;

    @Column(name = "content_standards")
    private String contentStandards;

    @Column(name = "performance_standards")
    private String performanceStandards;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "curriculumMap")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "strategies", "assessments", "curriculumMap" }, allowSetters = true)
    private Set<LearningCompetency> learningCompetencies = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "schYr", "curriculumMaps", "instructors", "students" }, allowSetters = true)
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CurriculumMap id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuarterNo() {
        return this.quarterNo;
    }

    public CurriculumMap quarterNo(Integer quarterNo) {
        this.setQuarterNo(quarterNo);
        return this;
    }

    public void setQuarterNo(Integer quarterNo) {
        this.quarterNo = quarterNo;
    }

    public Integer getWeekNo() {
        return this.weekNo;
    }

    public CurriculumMap weekNo(Integer weekNo) {
        this.setWeekNo(weekNo);
        return this;
    }

    public void setWeekNo(Integer weekNo) {
        this.weekNo = weekNo;
    }

    public String getTopic() {
        return this.topic;
    }

    public CurriculumMap topic(String topic) {
        this.setTopic(topic);
        return this;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getContentStandards() {
        return this.contentStandards;
    }

    public CurriculumMap contentStandards(String contentStandards) {
        this.setContentStandards(contentStandards);
        return this;
    }

    public void setContentStandards(String contentStandards) {
        this.contentStandards = contentStandards;
    }

    public String getPerformanceStandards() {
        return this.performanceStandards;
    }

    public CurriculumMap performanceStandards(String performanceStandards) {
        this.setPerformanceStandards(performanceStandards);
        return this;
    }

    public void setPerformanceStandards(String performanceStandards) {
        this.performanceStandards = performanceStandards;
    }

    public Set<LearningCompetency> getLearningCompetencies() {
        return this.learningCompetencies;
    }

    public void setLearningCompetencies(Set<LearningCompetency> learningCompetencies) {
        if (this.learningCompetencies != null) {
            this.learningCompetencies.forEach(i -> i.setCurriculumMap(null));
        }
        if (learningCompetencies != null) {
            learningCompetencies.forEach(i -> i.setCurriculumMap(this));
        }
        this.learningCompetencies = learningCompetencies;
    }

    public CurriculumMap learningCompetencies(Set<LearningCompetency> learningCompetencies) {
        this.setLearningCompetencies(learningCompetencies);
        return this;
    }

    public CurriculumMap addLearningCompetency(LearningCompetency learningCompetency) {
        this.learningCompetencies.add(learningCompetency);
        learningCompetency.setCurriculumMap(this);
        return this;
    }

    public CurriculumMap removeLearningCompetency(LearningCompetency learningCompetency) {
        this.learningCompetencies.remove(learningCompetency);
        learningCompetency.setCurriculumMap(null);
        return this;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public CurriculumMap course(Course course) {
        this.setCourse(course);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CurriculumMap)) {
            return false;
        }
        return getId() != null && getId().equals(((CurriculumMap) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CurriculumMap{" +
            "id=" + getId() +
            ", quarterNo=" + getQuarterNo() +
            ", weekNo=" + getWeekNo() +
            ", topic='" + getTopic() + "'" +
            ", contentStandards='" + getContentStandards() + "'" +
            ", performanceStandards='" + getPerformanceStandards() + "'" +
            "}";
    }
}
