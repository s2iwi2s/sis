package com.sis.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.Strategies} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StrategiesDTO implements Serializable {

    private Long id;

    private String name;

    private String description;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        if (!(o instanceof StrategiesDTO)) {
            return false;
        }

        StrategiesDTO strategiesDTO = (StrategiesDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, strategiesDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StrategiesDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", learningCompetency=" + getLearningCompetency() +
            "}";
    }
}
