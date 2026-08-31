package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.sql.Types;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.JdbcTypeCode;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Course implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 50)
    @Column(name = "subject", length = 50)
    private String subject;

    @Column(name = "hours_per_quarter")
    private Long hoursPerQuarter;

    @Lob
    @JdbcTypeCode(Types.LONGVARCHAR)
    @Column(name = "course_description")
    private String courseDescription;

    @Lob
    @JdbcTypeCode(Types.LONGVARCHAR)
    @Column(name = "course_objectives")
    private String courseObjectives;

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

    @JsonIgnoreProperties(
        value = { "instructor", "student", "course", "classSchedule", "gradeLevelPayables", "payments" },
        allowSetters = true
    )
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private AppConfig gradelevel;

    @JsonIgnoreProperties(value = { "course" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    private Departments department;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "course")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "learningCompetencies", "course" }, allowSetters = true)
    private Set<CurriculumMap> curriculumMaps = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private AcademicYear year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "year" }, allowSetters = true)
    private AcademicTerms terms;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Course id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return this.subject;
    }

    public Course subject(String subject) {
        this.setSubject(subject);
        return this;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Long getHoursPerQuarter() {
        return this.hoursPerQuarter;
    }

    public Course hoursPerQuarter(Long hoursPerQuarter) {
        this.setHoursPerQuarter(hoursPerQuarter);
        return this;
    }

    public void setHoursPerQuarter(Long hoursPerQuarter) {
        this.hoursPerQuarter = hoursPerQuarter;
    }

    public String getCourseDescription() {
        return this.courseDescription;
    }

    public Course courseDescription(String courseDescription) {
        this.setCourseDescription(courseDescription);
        return this;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public String getCourseObjectives() {
        return this.courseObjectives;
    }

    public Course courseObjectives(String courseObjectives) {
        this.setCourseObjectives(courseObjectives);
        return this;
    }

    public void setCourseObjectives(String courseObjectives) {
        this.courseObjectives = courseObjectives;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Course createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Course createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return this.lastModifiedBy;
    }

    public Course lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Instant getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Course lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public AppConfig getGradelevel() {
        return this.gradelevel;
    }

    public void setGradelevel(AppConfig appConfig) {
        this.gradelevel = appConfig;
    }

    public Course gradelevel(AppConfig appConfig) {
        this.setGradelevel(appConfig);
        return this;
    }

    public Departments getDepartment() {
        return this.department;
    }

    public void setDepartment(Departments departments) {
        this.department = departments;
    }

    public Course department(Departments departments) {
        this.setDepartment(departments);
        return this;
    }

    public Set<CurriculumMap> getCurriculumMaps() {
        return this.curriculumMaps;
    }

    public void setCurriculumMaps(Set<CurriculumMap> curriculumMaps) {
        if (this.curriculumMaps != null) {
            this.curriculumMaps.forEach(i -> i.setCourse(null));
        }
        if (curriculumMaps != null) {
            curriculumMaps.forEach(i -> i.setCourse(this));
        }
        this.curriculumMaps = curriculumMaps;
    }

    public Course curriculumMaps(Set<CurriculumMap> curriculumMaps) {
        this.setCurriculumMaps(curriculumMaps);
        return this;
    }

    public Course addCurriculumMap(CurriculumMap curriculumMap) {
        this.curriculumMaps.add(curriculumMap);
        curriculumMap.setCourse(this);
        return this;
    }

    public Course removeCurriculumMap(CurriculumMap curriculumMap) {
        this.curriculumMaps.remove(curriculumMap);
        curriculumMap.setCourse(null);
        return this;
    }

    public AcademicYear getYear() {
        return this.year;
    }

    public void setYear(AcademicYear academicYear) {
        this.year = academicYear;
    }

    public Course year(AcademicYear academicYear) {
        this.setYear(academicYear);
        return this;
    }

    public AcademicTerms getTerms() {
        return this.terms;
    }

    public void setTerms(AcademicTerms academicTerms) {
        this.terms = academicTerms;
    }

    public Course terms(AcademicTerms academicTerms) {
        this.setTerms(academicTerms);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return getId() != null && getId().equals(((Course) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", subject='" + getSubject() + "'" +
            ", hoursPerQuarter=" + getHoursPerQuarter() +
            ", courseDescription='" + getCourseDescription() + "'" +
            ", courseObjectives='" + getCourseObjectives() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
