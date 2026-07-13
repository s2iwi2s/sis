package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;
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

    @Size(max = 50)
    private String createdBy;

    private Instant createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private CurriculumMapDTO curriculumMap;

    List<StrategiesDTO> strategiesDTOS;

    List<AssessmentDTO> assessmentDTOS;

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

    public CurriculumMapDTO getCurriculumMap() {
        return curriculumMap;
    }

    public void setCurriculumMap(CurriculumMapDTO curriculumMap) {
        this.curriculumMap = curriculumMap;
    }

    public List<StrategiesDTO> getStrategiesDTOS() {
        return strategiesDTOS;
    }

    public void setStrategiesDTOS(List<StrategiesDTO> strategiesDTOS) {
        this.strategiesDTOS = strategiesDTOS;
    }

    public List<AssessmentDTO> getAssessmentDTOS() {
        return assessmentDTOS;
    }

    public void setAssessmentDTOS(List<AssessmentDTO> assessmentDTOS) {
        this.assessmentDTOS = assessmentDTOS;
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
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", curriculumMap=" + getCurriculumMap() +
            "}";
    }
}
