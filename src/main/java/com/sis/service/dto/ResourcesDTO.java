package com.sis.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.Resources} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ResourcesDTO implements Serializable {

    private Long id;

    @Size(max = 50)
    private String fileName;

    private String fileNameOnServer;

    @Lob
    private byte[] document;

    private String documentContentType;
    private StrategiesDTO strategies;

    private AssessmentDTO assessment;

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

    public String getFileNameOnServer() {
        return fileNameOnServer;
    }

    public void setFileNameOnServer(String fileNameOnServer) {
        this.fileNameOnServer = fileNameOnServer;
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

    public StrategiesDTO getStrategies() {
        return strategies;
    }

    public void setStrategies(StrategiesDTO strategies) {
        this.strategies = strategies;
    }

    public AssessmentDTO getAssessment() {
        return assessment;
    }

    public void setAssessment(AssessmentDTO assessment) {
        this.assessment = assessment;
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
            ", fileNameOnServer='" + getFileNameOnServer() + "'" +
            ", document='" + getDocument() + "'" +
            ", strategies=" + getStrategies() +
            ", assessment=" + getAssessment() +
            "}";
    }
}
