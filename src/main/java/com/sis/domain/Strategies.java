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
 * A Strategies.
 */
@Entity
@Table(name = "strategies")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Strategies extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_strategies__resources",
        joinColumns = @JoinColumn(name = "strategies_id"),
        inverseJoinColumns = @JoinColumn(name = "resources_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "strategies", "assessments" }, allowSetters = true)
    private Set<Resources> resources = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "strategies", "assessments", "curriculumMap" }, allowSetters = true)
    private LearningCompetency learningCompetency;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Strategies id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Strategies name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Strategies description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Strategies createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public Strategies createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public Strategies lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public Strategies lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public Set<Resources> getResources() {
        return this.resources;
    }

    public void setResources(Set<Resources> resources) {
        this.resources = resources;
    }

    public Strategies resources(Set<Resources> resources) {
        this.setResources(resources);
        return this;
    }

    public Strategies addResources(Resources resources) {
        this.resources.add(resources);
        return this;
    }

    public Strategies removeResources(Resources resources) {
        this.resources.remove(resources);
        return this;
    }

    public LearningCompetency getLearningCompetency() {
        return this.learningCompetency;
    }

    public void setLearningCompetency(LearningCompetency learningCompetency) {
        this.learningCompetency = learningCompetency;
    }

    public Strategies learningCompetency(LearningCompetency learningCompetency) {
        this.setLearningCompetency(learningCompetency);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Strategies)) {
            return false;
        }
        return getId() != null && getId().equals(((Strategies) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Strategies{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
