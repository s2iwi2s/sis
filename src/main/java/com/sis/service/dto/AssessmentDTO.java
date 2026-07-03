package com.sis.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.sis.domain.Assessment} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AssessmentDTO implements Serializable {

    private Long id;

    private String name;

    private String instruction;

    @Lob
    private String markScheme;

    @Size(max = 50)
    private String createdBy;

    private Instant createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private Set<ResourcesDTO> resourceses = new HashSet<>();

    private LearningCompetencyDTO learningCompetency;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public String getMarkScheme() {
        return markScheme;
    }

    public void setMarkScheme(String markScheme) {
        this.markScheme = markScheme;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Instant getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<ResourcesDTO> getResourceses() {
        return resourceses;
    }

    public void setResourceses(Set<ResourcesDTO> resourceses) {
        this.resourceses = resourceses;
    }

    public LearningCompetencyDTO getLearningCompetency() {
        return learningCompetency;
    }

    public void setLearningCompetency(LearningCompetencyDTO learningCompetency) {
        this.learningCompetency = learningCompetency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AssessmentDTO)) {
            return false;
        }

        AssessmentDTO assessmentDTO = (AssessmentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, assessmentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AssessmentDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", instruction='" + getInstruction() + "'" +
            ", markScheme='" + getMarkScheme() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", resourceses=" + getResourceses() +
            ", learningCompetency=" + getLearningCompetency() +
            "}";
    }
}
