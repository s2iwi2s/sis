package com.sis.service.dto;

import jakarta.persistence.Lob;
import java.io.Serializable;
import java.util.Objects;

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
            ", learningCompetency=" + getLearningCompetency() +
            "}";
    }
}
