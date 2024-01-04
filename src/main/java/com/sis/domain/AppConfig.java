package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AppConfig.
 */
@Entity
@Table(name = "app_config")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppConfig extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "value")
    private String value;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "json")
    private String json;

    @Column(name = "priority")
    private Integer priority;

    @JsonIgnoreProperties(value = { "currSchYr" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "currSchYr")
    private Org org;

    @JsonIgnoreProperties(value = { "gender", "courses" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "gender")
    private Instructor instructor;

    @JsonIgnoreProperties(value = { "gender", "courses" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "gender")
    private Student student;

    @JsonIgnoreProperties(value = { "schYr", "curriculumMaps", "instructors", "students" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "schYr")
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppConfig id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public AppConfig code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getValue() {
        return this.value;
    }

    public AppConfig value(String value) {
        this.setValue(value);
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return this.description;
    }

    public AppConfig description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getJson() {
        return this.json;
    }

    public AppConfig json(String json) {
        this.setJson(json);
        return this;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public AppConfig priority(Integer priority) {
        this.setPriority(priority);
        return this;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Org getOrg() {
        return this.org;
    }

    public void setOrg(Org org) {
        if (this.org != null) {
            this.org.setCurrSchYr(null);
        }
        if (org != null) {
            org.setCurrSchYr(this);
        }
        this.org = org;
    }

    public AppConfig org(Org org) {
        this.setOrg(org);
        return this;
    }

    public Instructor getInstructor() {
        return this.instructor;
    }

    public void setInstructor(Instructor instructor) {
        if (this.instructor != null) {
            this.instructor.setGender(null);
        }
        if (instructor != null) {
            instructor.setGender(this);
        }
        this.instructor = instructor;
    }

    public AppConfig instructor(Instructor instructor) {
        this.setInstructor(instructor);
        return this;
    }

    public Student getStudent() {
        return this.student;
    }

    public void setStudent(Student student) {
        if (this.student != null) {
            this.student.setGender(null);
        }
        if (student != null) {
            student.setGender(this);
        }
        this.student = student;
    }

    public AppConfig student(Student student) {
        this.setStudent(student);
        return this;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        if (this.course != null) {
            this.course.setSchYr(null);
        }
        if (course != null) {
            course.setSchYr(this);
        }
        this.course = course;
    }

    public AppConfig course(Course course) {
        this.setCourse(course);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppConfig)) {
            return false;
        }
        return getId() != null && getId().equals(((AppConfig) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppConfig{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", value='" + getValue() + "'" +
            ", description='" + getDescription() + "'" +
            ", json='" + getJson() + "'" +
            ", priority=" + getPriority() +
            "}";
    }
}
