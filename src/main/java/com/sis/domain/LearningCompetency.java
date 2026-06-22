package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LearningCompetency.
 */
@Entity
@Table(name = "learning_competency")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LearningCompetency extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "seq_no")
    private Integer seqNo;

    @Size(max = 50)
    @Column(name = "competency_code", length = 50)
    private String competencyCode;

    @Column(name = "description")
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "learningCompetency")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "resources", "learningCompetency" }, allowSetters = true)
    private Set<Strategies> strategies = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "learningCompetency")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "resources", "learningCompetency" }, allowSetters = true)
    private Set<Assessment> assessments = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "learningCompetencies", "course" }, allowSetters = true)
    private CurriculumMap curriculumMap;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LearningCompetency id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSeqNo() {
        return this.seqNo;
    }

    public LearningCompetency seqNo(Integer seqNo) {
        this.setSeqNo(seqNo);
        return this;
    }

    public void setSeqNo(Integer seqNo) {
        this.seqNo = seqNo;
    }

    public String getCompetencyCode() {
        return this.competencyCode;
    }

    public LearningCompetency competencyCode(String competencyCode) {
        this.setCompetencyCode(competencyCode);
        return this;
    }

    public void setCompetencyCode(String competencyCode) {
        this.competencyCode = competencyCode;
    }

    public String getDescription() {
        return this.description;
    }

    public LearningCompetency description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LearningCompetency createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public LearningCompetency createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public LearningCompetency lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public LearningCompetency lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public Set<Strategies> getStrategies() {
        return this.strategies;
    }

    public void setStrategies(Set<Strategies> strategies) {
        if (this.strategies != null) {
            this.strategies.forEach(i -> i.setLearningCompetency(null));
        }
        if (strategies != null) {
            strategies.forEach(i -> i.setLearningCompetency(this));
        }
        this.strategies = strategies;
    }

    public LearningCompetency strategies(Set<Strategies> strategies) {
        this.setStrategies(strategies);
        return this;
    }

    public LearningCompetency addStrategies(Strategies strategies) {
        this.strategies.add(strategies);
        strategies.setLearningCompetency(this);
        return this;
    }

    public LearningCompetency removeStrategies(Strategies strategies) {
        this.strategies.remove(strategies);
        strategies.setLearningCompetency(null);
        return this;
    }

    public Set<Assessment> getAssessments() {
        return this.assessments;
    }

    public void setAssessments(Set<Assessment> assessments) {
        if (this.assessments != null) {
            this.assessments.forEach(i -> i.setLearningCompetency(null));
        }
        if (assessments != null) {
            assessments.forEach(i -> i.setLearningCompetency(this));
        }
        this.assessments = assessments;
    }

    public LearningCompetency assessments(Set<Assessment> assessments) {
        this.setAssessments(assessments);
        return this;
    }

    public LearningCompetency addAssessment(Assessment assessment) {
        this.assessments.add(assessment);
        assessment.setLearningCompetency(this);
        return this;
    }

    public LearningCompetency removeAssessment(Assessment assessment) {
        this.assessments.remove(assessment);
        assessment.setLearningCompetency(null);
        return this;
    }

    public CurriculumMap getCurriculumMap() {
        return this.curriculumMap;
    }

    public void setCurriculumMap(CurriculumMap curriculumMap) {
        this.curriculumMap = curriculumMap;
    }

    public LearningCompetency curriculumMap(CurriculumMap curriculumMap) {
        this.setCurriculumMap(curriculumMap);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LearningCompetency)) {
            return false;
        }
        return getId() != null && getId().equals(((LearningCompetency) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LearningCompetency{" +
            "id=" + getId() +
            ", seqNo=" + getSeqNo() +
            ", competencyCode='" + getCompetencyCode() + "'" +
            ", description='" + getDescription() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
