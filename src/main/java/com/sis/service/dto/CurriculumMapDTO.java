package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.CurriculumMap} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CurriculumMapDTO implements Serializable {

    private Long id;

    private Integer quarterNo;

    private Integer weekNo;

    private String topic;

    private String contentStandards;

    private String performanceStandards;

    @Size(max = 50)
    private String createdBy;

    private Instant createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private CourseDTO course;

    private List<LearningCompetencyDTO> learningCompetencyDTOS;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuarterNo() {
        return quarterNo;
    }

    public void setQuarterNo(Integer quarterNo) {
        this.quarterNo = quarterNo;
    }

    public Integer getWeekNo() {
        return weekNo;
    }

    public void setWeekNo(Integer weekNo) {
        this.weekNo = weekNo;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getContentStandards() {
        return contentStandards;
    }

    public void setContentStandards(String contentStandards) {
        this.contentStandards = contentStandards;
    }

    public String getPerformanceStandards() {
        return performanceStandards;
    }

    public void setPerformanceStandards(String performanceStandards) {
        this.performanceStandards = performanceStandards;
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

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public List<LearningCompetencyDTO> getLearningCompetencyDTOS() {
        return learningCompetencyDTOS;
    }

    public void setLearningCompetencyDTOS(List<LearningCompetencyDTO> learningCompetencyDTOS) {
        this.learningCompetencyDTOS = learningCompetencyDTOS;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CurriculumMapDTO)) {
            return false;
        }

        CurriculumMapDTO curriculumMapDTO = (CurriculumMapDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, curriculumMapDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CurriculumMapDTO{" +
            "id=" + getId() +
            ", quarterNo=" + getQuarterNo() +
            ", weekNo=" + getWeekNo() +
            ", topic='" + getTopic() + "'" +
            ", contentStandards='" + getContentStandards() + "'" +
            ", performanceStandards='" + getPerformanceStandards() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", course=" + getCourse() +
            "}";
    }
}
