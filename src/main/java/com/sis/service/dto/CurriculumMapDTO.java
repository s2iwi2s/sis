package com.sis.service.dto;

import java.io.Serializable;
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

    private CourseDTO course;

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

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
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
            ", course=" + getCourse() +
            "}";
    }
}
