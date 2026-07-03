package com.sis.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.sis.domain.Resources} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ResourcesDTO implements Serializable {

    private Long id;

    @Size(max = 50)
    private String fileName;

    @Lob
    private byte[] document;

    private String documentContentType;

    @Size(max = 50)
    private String createdBy;

    private Instant createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private Set<StrategiesDTO> strategieses = new HashSet<>();

    private Set<AssessmentDTO> assessments = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getDocument() {
        return document;
    }

    public void setDocument(byte[] document) {
        this.document = document;
    }

    public String getDocumentContentType() {
        return documentContentType;
    }

    public void setDocumentContentType(String documentContentType) {
        this.documentContentType = documentContentType;
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

    public Set<StrategiesDTO> getStrategieses() {
        return strategieses;
    }

    public void setStrategieses(Set<StrategiesDTO> strategieses) {
        this.strategieses = strategieses;
    }

    public Set<AssessmentDTO> getAssessments() {
        return assessments;
    }

    public void setAssessments(Set<AssessmentDTO> assessments) {
        this.assessments = assessments;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResourcesDTO)) {
            return false;
        }

        ResourcesDTO resourcesDTO = (ResourcesDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, resourcesDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ResourcesDTO{" +
            "id=" + getId() +
            ", fileName='" + getFileName() + "'" +
            ", document='" + getDocument() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", strategieses=" + getStrategieses() +
            ", assessments=" + getAssessments() +
            "}";
    }
}
