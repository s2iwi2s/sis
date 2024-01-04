package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 50)
    @Column(name = "gradelevel", length = 50)
    private String gradelevel;

    @Size(max = 50)
    @Column(name = "subject", length = 50)
    private String subject;

    @Column(name = "hours_per_quarter")
    private Long hoursPerQuarter;

    @Lob
    @Column(name = "course_description")
    private String courseDescription;

    @Lob
    @Column(name = "course_objectives")
    private String courseObjectives;

    @JsonIgnoreProperties(value = { "user", "org", "instructor", "student", "course" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private AppConfig schYr;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "course")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "learningCompetencies", "course" }, allowSetters = true)
    private Set<CurriculumMap> curriculumMaps = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_course__instructor",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "instructor_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "gender", "courses" }, allowSetters = true)
    private Set<Instructor> instructors = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_course__student",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "gender", "courses" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

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

    public String getGradelevel() {
        return this.gradelevel;
    }

    public Course gradelevel(String gradelevel) {
        this.setGradelevel(gradelevel);
        return this;
    }

    public void setGradelevel(String gradelevel) {
        this.gradelevel = gradelevel;
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

    public AppConfig getSchYr() {
        return this.schYr;
    }

    public void setSchYr(AppConfig appConfig) {
        this.schYr = appConfig;
    }

    public Course schYr(AppConfig appConfig) {
        this.setSchYr(appConfig);
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

    public Set<Instructor> getInstructors() {
        return this.instructors;
    }

    public void setInstructors(Set<Instructor> instructors) {
        this.instructors = instructors;
    }

    public Course instructors(Set<Instructor> instructors) {
        this.setInstructors(instructors);
        return this;
    }

    public Course addInstructor(Instructor instructor) {
        this.instructors.add(instructor);
        return this;
    }

    public Course removeInstructor(Instructor instructor) {
        this.instructors.remove(instructor);
        return this;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }

    public Course students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public Course addStudent(Student student) {
        this.students.add(student);
        return this;
    }

    public Course removeStudent(Student student) {
        this.students.remove(student);
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
            ", gradelevel='" + getGradelevel() + "'" +
            ", subject='" + getSubject() + "'" +
            ", hoursPerQuarter=" + getHoursPerQuarter() +
            ", courseDescription='" + getCourseDescription() + "'" +
            ", courseObjectives='" + getCourseObjectives() + "'" +
            "}";
    }
}
