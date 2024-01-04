package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.LearningCompetency} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LearningCompetencyDTO implements Serializable {

    private Long id;

    private Integer seqNo;

    @Size(max = 50)
    private String competencyCode;

    private String description;

    private CurriculumMapDTO curriculumMap;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(Integer seqNo) {
        this.seqNo = seqNo;
    }

    public String getCompetencyCode() {
        return competencyCode;
    }

    public void setCompetencyCode(String competencyCode) {
        this.competencyCode = competencyCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CurriculumMapDTO getCurriculumMap() {
        return curriculumMap;
    }

    public void setCurriculumMap(CurriculumMapDTO curriculumMap) {
        this.curriculumMap = curriculumMap;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LearningCompetencyDTO)) {
            return false;
        }

        LearningCompetencyDTO learningCompetencyDTO = (LearningCompetencyDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, learningCompetencyDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LearningCompetencyDTO{" +
            "id=" + getId() +
            ", seqNo=" + getSeqNo() +
            ", competencyCode='" + getCompetencyCode() + "'" +
            ", description='" + getDescription() + "'" +
            ", curriculumMap=" + getCurriculumMap() +
            "}";
    }
}
