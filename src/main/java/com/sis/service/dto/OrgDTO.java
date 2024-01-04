package com.sis.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.Org} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrgDTO implements Serializable {

    private Long id;

    private String name;

    private String logo;

    private String address;

    private AppConfigDTO currSchYr;

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

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public AppConfigDTO getCurrSchYr() {
        return currSchYr;
    }

    public void setCurrSchYr(AppConfigDTO currSchYr) {
        this.currSchYr = currSchYr;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrgDTO)) {
            return false;
        }

        OrgDTO orgDTO = (OrgDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, orgDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrgDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", logo='" + getLogo() + "'" +
            ", address='" + getAddress() + "'" +
            ", currSchYr=" + getCurrSchYr() +
            "}";
    }
}
