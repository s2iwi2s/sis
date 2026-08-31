package com.sis.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.GradeLevelPayables} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GradeLevelPayablesDTO implements Serializable {

    private Long id;

    private Boolean active;

    private AppConfigDTO gradelevel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public AppConfigDTO getGradelevel() {
        return gradelevel;
    }

    public void setGradelevel(AppConfigDTO gradelevel) {
        this.gradelevel = gradelevel;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GradeLevelPayablesDTO)) {
            return false;
        }

        GradeLevelPayablesDTO gradeLevelPayablesDTO = (GradeLevelPayablesDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gradeLevelPayablesDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GradeLevelPayablesDTO{" +
            "id=" + getId() +
            ", active='" + getActive() + "'" +
            ", gradelevel=" + getGradelevel() +
            "}";
    }
}
