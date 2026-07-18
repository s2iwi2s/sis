package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CourseSchedule.
 */
@Entity
@Table(name = "course_schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseSchedule implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 50)
    @Column(name = "room", length = 50)
    private String room;

    @Column(name = "week_day")
    private Integer weekDay;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Size(max = 250)
    @Column(name = "description", length = 250)
    private String description;

    @Size(max = 50)
    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_date")
    private Instant createdDate;

    @Size(max = 50)
    @Column(name = "last_modified_by", length = 50)
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private Instant lastModifiedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "year" }, allowSetters = true)
    private AcademicTerms terms;

    @ManyToOne(fetch = FetchType.LAZY)
    private AcademicYear year;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "courseSchedules")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "gender", "user", "courseSchedules" }, allowSetters = true)
    private Set<Instructor> instructors = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "courseSchedules")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "gender", "user", "courseSchedules" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CourseSchedule id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoom() {
        return this.room;
    }

    public CourseSchedule room(String room) {
        this.setRoom(room);
        return this;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Integer getWeekDay() {
        return this.weekDay;
    }

    public CourseSchedule weekDay(Integer weekDay) {
        this.setWeekDay(weekDay);
        return this;
    }

    public void setWeekDay(Integer weekDay) {
        this.weekDay = weekDay;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public CourseSchedule startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public CourseSchedule endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public String getDescription() {
        return this.description;
    }

    public CourseSchedule description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public CourseSchedule createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public CourseSchedule createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return this.lastModifiedBy;
    }

    public CourseSchedule lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Instant getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public CourseSchedule lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public AcademicTerms getTerms() {
        return this.terms;
    }

    public void setTerms(AcademicTerms academicTerms) {
        this.terms = academicTerms;
    }

    public CourseSchedule terms(AcademicTerms academicTerms) {
        this.setTerms(academicTerms);
        return this;
    }

    public AcademicYear getYear() {
        return this.year;
    }

    public void setYear(AcademicYear academicYear) {
        this.year = academicYear;
    }

    public CourseSchedule year(AcademicYear academicYear) {
        this.setYear(academicYear);
        return this;
    }

    public Set<Instructor> getInstructors() {
        return this.instructors;
    }

    public void setInstructors(Set<Instructor> instructors) {
        if (this.instructors != null) {
            this.instructors.forEach(i -> i.removeCourseSchedule(this));
        }
        if (instructors != null) {
            instructors.forEach(i -> i.addCourseSchedule(this));
        }
        this.instructors = instructors;
    }

    public CourseSchedule instructors(Set<Instructor> instructors) {
        this.setInstructors(instructors);
        return this;
    }

    public CourseSchedule addInstructor(Instructor instructor) {
        this.instructors.add(instructor);
        instructor.getCourseSchedules().add(this);
        return this;
    }

    public CourseSchedule removeInstructor(Instructor instructor) {
        this.instructors.remove(instructor);
        instructor.getCourseSchedules().remove(this);
        return this;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        if (this.students != null) {
            this.students.forEach(i -> i.removeCourseSchedule(this));
        }
        if (students != null) {
            students.forEach(i -> i.addCourseSchedule(this));
        }
        this.students = students;
    }

    public CourseSchedule students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public CourseSchedule addStudent(Student student) {
        this.students.add(student);
        student.getCourseSchedules().add(this);
        return this;
    }

    public CourseSchedule removeStudent(Student student) {
        this.students.remove(student);
        student.getCourseSchedules().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseSchedule)) {
            return false;
        }
        return getId() != null && getId().equals(((CourseSchedule) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseSchedule{" +
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
            "}";
    }
}
