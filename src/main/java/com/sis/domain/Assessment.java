package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Assessment.
 */
@Entity
@Table(name = "assessment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Assessment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "instruction")
    private String instruction;

    @Lob
    @Column(name = "mark_scheme")
    private String markScheme;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "assessment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "strategies", "assessment" }, allowSetters = true)
    private Set<Resources> resources = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "strategies", "assessments", "curriculumMap" }, allowSetters = true)
    private LearningCompetency learningCompetency;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Assessment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Assessment name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstruction() {
        return this.instruction;
    }

    public Assessment instruction(String instruction) {
        this.setInstruction(instruction);
        return this;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public String getMarkScheme() {
        return this.markScheme;
    }

    public Assessment markScheme(String markScheme) {
        this.setMarkScheme(markScheme);
        return this;
    }

    public void setMarkScheme(String markScheme) {
        this.markScheme = markScheme;
    }

    public Set<Resources> getResources() {
        return this.resources;
    }

    public void setResources(Set<Resources> resources) {
        if (this.resources != null) {
            this.resources.forEach(i -> i.setAssessment(null));
        }
        if (resources != null) {
            resources.forEach(i -> i.setAssessment(this));
        }
        this.resources = resources;
    }

    public Assessment resources(Set<Resources> resources) {
        this.setResources(resources);
        return this;
    }

    public Assessment addResources(Resources resources) {
        this.resources.add(resources);
        resources.setAssessment(this);
        return this;
    }

    public Assessment removeResources(Resources resources) {
        this.resources.remove(resources);
        resources.setAssessment(null);
        return this;
    }

    public LearningCompetency getLearningCompetency() {
        return this.learningCompetency;
    }

    public void setLearningCompetency(LearningCompetency learningCompetency) {
        this.learningCompetency = learningCompetency;
    }

    public Assessment learningCompetency(LearningCompetency learningCompetency) {
        this.setLearningCompetency(learningCompetency);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Assessment)) {
            return false;
        }
        return getId() != null && getId().equals(((Assessment) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Assessment{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", instruction='" + getInstruction() + "'" +
            ", markScheme='" + getMarkScheme() + "'" +
            "}";
    }
}
