package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.sis.domain.CourseSchedule} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseScheduleDTO implements Serializable {

    private Long id;

    @Size(max = 50)
    private String room;

    private Integer weekDay;

    private Instant startTime;

    private Instant endTime;

    @Size(max = 250)
    private String description;

    @Size(max = 50)
    private String createdBy;

    private Instant createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private AcademicTermsDTO terms;

    private AcademicYearDTO year;

    private ClassScheduleDTO classSchedule;

    private Set<StudentDTO> students = new HashSet<>();

    private Set<InstructorDTO> instructors = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Integer getWeekDay() {
        return weekDay;
    }

    public void setWeekDay(Integer weekDay) {
        this.weekDay = weekDay;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
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

    public AcademicTermsDTO getTerms() {
        return terms;
    }

    public void setTerms(AcademicTermsDTO terms) {
        this.terms = terms;
    }

    public AcademicYearDTO getYear() {
        return year;
    }

    public void setYear(AcademicYearDTO year) {
        this.year = year;
    }

    public ClassScheduleDTO getClassSchedule() {
        return classSchedule;
    }

    public void setClassSchedule(ClassScheduleDTO classSchedule) {
        this.classSchedule = classSchedule;
    }

    public Set<StudentDTO> getStudents() {
        return students;
    }

    public void setStudents(Set<StudentDTO> students) {
        this.students = students;
    }

    public Set<InstructorDTO> getInstructors() {
        return instructors;
    }

    public void setInstructors(Set<InstructorDTO> instructors) {
        this.instructors = instructors;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseScheduleDTO)) {
            return false;
        }

        CourseScheduleDTO courseScheduleDTO = (CourseScheduleDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, courseScheduleDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseScheduleDTO{" +
            "id=" + getId() +
            ", room='" + getRoom() + "'" +
            ", weekDay=" + getWeekDay() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", description='" + getDescription() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", terms=" + getTerms() +
            ", year=" + getYear() +
            ", classSchedule=" + getClassSchedule() +
            ", students=" + getStudents() +
            ", instructors=" + getInstructors() +
            "}";
    }
}
