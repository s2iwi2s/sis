package com.sis.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.sis.domain.Course} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseDTO implements Serializable {

    private Long id;

    private AppConfigDTO gradelevel;

    @Size(max = 50)
    private String subject;

    private Long hoursPerQuarter;

    @Lob
    private String courseDescription;

    @Lob
    private String courseObjectives;

    private AppConfigDTO schYr;

    private Set<InstructorDTO> instructors = new HashSet<>();

    private Set<StudentDTO> students = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppConfigDTO getGradelevel() {
        return gradelevel;
    }

    public void setGradelevel(AppConfigDTO gradelevel) {
        this.gradelevel = gradelevel;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Long getHoursPerQuarter() {
        return hoursPerQuarter;
    }

    public void setHoursPerQuarter(Long hoursPerQuarter) {
        this.hoursPerQuarter = hoursPerQuarter;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public String getCourseObjectives() {
        return courseObjectives;
    }

    public void setCourseObjectives(String courseObjectives) {
        this.courseObjectives = courseObjectives;
    }

    public AppConfigDTO getSchYr() {
        return schYr;
    }

    public void setSchYr(AppConfigDTO schYr) {
        this.schYr = schYr;
    }

    public Set<InstructorDTO> getInstructors() {
        return instructors;
    }

    public void setInstructors(Set<InstructorDTO> instructors) {
        this.instructors = instructors;
    }

    public Set<StudentDTO> getStudents() {
        return students;
    }

    public void setStudents(Set<StudentDTO> students) {
        this.students = students;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseDTO)) {
            return false;
        }

        CourseDTO courseDTO = (CourseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, courseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseDTO{" +
            "id=" + getId() +
            ", gradelevel='" + getGradelevel() + "'" +
            ", subject='" + getSubject() + "'" +
            ", hoursPerQuarter=" + getHoursPerQuarter() +
            ", courseDescription='" + getCourseDescription() + "'" +
            ", courseObjectives='" + getCourseObjectives() + "'" +
            ", schYr=" + getSchYr() +
            ", instructors=" + getInstructors() +
            ", students=" + getStudents() +
            "}";
    }
}
