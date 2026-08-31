package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.ClassSchedule} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClassScheduleDTO implements Serializable {

    private Long id;

    @Size(max = 20)
    private String name;

    private AppConfigDTO gradelevel;

    private AcademicTermsDTO terms;

    private AcademicYearDTO year;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AppConfigDTO getGradelevel() {
        return gradelevel;
    }

    public void setGradelevel(AppConfigDTO gradelevel) {
        this.gradelevel = gradelevel;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClassScheduleDTO)) {
            return false;
        }

        ClassScheduleDTO classScheduleDTO = (ClassScheduleDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, classScheduleDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClassScheduleDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", gradelevel=" + getGradelevel() +
            ", terms=" + getTerms() +
            ", year=" + getYear() +
            "}";
    }
}
