package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ClassSchedule.
 */
@Entity
@Table(name = "class_schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClassSchedule implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 20)
    @Column(name = "name", length = 20)
    private String name;

    @JsonIgnoreProperties(
        value = { "instructor", "student", "course", "classSchedule", "gradeLevelPayables", "payments" },
        allowSetters = true
    )
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private AppConfig gradelevel;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "classSchedule")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "terms", "year", "classSchedule", "students", "instructors" }, allowSetters = true)
    private Set<CourseSchedule> courseSchedules = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "year" }, allowSetters = true)
    private AcademicTerms terms;

    @ManyToOne(fetch = FetchType.LAZY)
    private AcademicYear year;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ClassSchedule id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ClassSchedule name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AppConfig getGradelevel() {
        return this.gradelevel;
    }

    public void setGradelevel(AppConfig appConfig) {
        this.gradelevel = appConfig;
    }

    public ClassSchedule gradelevel(AppConfig appConfig) {
        this.setGradelevel(appConfig);
        return this;
    }

    public Set<CourseSchedule> getCourseSchedules() {
        return this.courseSchedules;
    }

    public void setCourseSchedules(Set<CourseSchedule> courseSchedules) {
        if (this.courseSchedules != null) {
            this.courseSchedules.forEach(i -> i.setClassSchedule(null));
        }
        if (courseSchedules != null) {
            courseSchedules.forEach(i -> i.setClassSchedule(this));
        }
        this.courseSchedules = courseSchedules;
    }

    public ClassSchedule courseSchedules(Set<CourseSchedule> courseSchedules) {
        this.setCourseSchedules(courseSchedules);
        return this;
    }

    public ClassSchedule addCourseSchedule(CourseSchedule courseSchedule) {
        this.courseSchedules.add(courseSchedule);
        courseSchedule.setClassSchedule(this);
        return this;
    }

    public ClassSchedule removeCourseSchedule(CourseSchedule courseSchedule) {
        this.courseSchedules.remove(courseSchedule);
        courseSchedule.setClassSchedule(null);
        return this;
    }

    public AcademicTerms getTerms() {
        return this.terms;
    }

    public void setTerms(AcademicTerms academicTerms) {
        this.terms = academicTerms;
    }

    public ClassSchedule terms(AcademicTerms academicTerms) {
        this.setTerms(academicTerms);
        return this;
    }

    public AcademicYear getYear() {
        return this.year;
    }

    public void setYear(AcademicYear academicYear) {
        this.year = academicYear;
    }

    public ClassSchedule year(AcademicYear academicYear) {
        this.setYear(academicYear);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClassSchedule)) {
            return false;
        }
        return getId() != null && getId().equals(((ClassSchedule) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClassSchedule{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
