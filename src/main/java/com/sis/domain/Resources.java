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
 * A Resources.
 */
@Entity
@Table(name = "resources")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Resources implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 50)
    @Column(name = "file_name", length = 50)
    private String fileName;

    @Lob
    @Column(name = "document")
    private byte[] document;

    @Column(name = "document_content_type")
    private String documentContentType;

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

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resourceses")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "resourceses", "learningCompetency" }, allowSetters = true)
    private Set<Strategies> strategieses = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resourceses")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "resourceses", "learningCompetency" }, allowSetters = true)
    private Set<Assessment> assessments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Resources id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return this.fileName;
    }

    public Resources fileName(String fileName) {
        this.setFileName(fileName);
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getDocument() {
        return this.document;
    }

    public Resources document(byte[] document) {
        this.setDocument(document);
        return this;
    }

    public void setDocument(byte[] document) {
        this.document = document;
    }

    public String getDocumentContentType() {
        return this.documentContentType;
    }

    public Resources documentContentType(String documentContentType) {
        this.documentContentType = documentContentType;
        return this;
    }

    public void setDocumentContentType(String documentContentType) {
        this.documentContentType = documentContentType;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Resources createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Resources createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return this.lastModifiedBy;
    }

    public Resources lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Instant getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Resources lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<Strategies> getStrategieses() {
        return this.strategieses;
    }

    public void setStrategieses(Set<Strategies> strategieses) {
        if (this.strategieses != null) {
            this.strategieses.forEach(i -> i.removeResources(this));
        }
        if (strategieses != null) {
            strategieses.forEach(i -> i.addResources(this));
        }
        this.strategieses = strategieses;
    }

    public Resources strategieses(Set<Strategies> strategieses) {
        this.setStrategieses(strategieses);
        return this;
    }

    public Resources addStrategies(Strategies strategies) {
        this.strategieses.add(strategies);
        strategies.getResourceses().add(this);
        return this;
    }

    public Resources removeStrategies(Strategies strategies) {
        this.strategieses.remove(strategies);
        strategies.getResourceses().remove(this);
        return this;
    }

    public Set<Assessment> getAssessments() {
        return this.assessments;
    }

    public void setAssessments(Set<Assessment> assessments) {
        if (this.assessments != null) {
            this.assessments.forEach(i -> i.removeResources(this));
        }
        if (assessments != null) {
            assessments.forEach(i -> i.addResources(this));
        }
        this.assessments = assessments;
    }

    public Resources assessments(Set<Assessment> assessments) {
        this.setAssessments(assessments);
        return this;
    }

    public Resources addAssessment(Assessment assessment) {
        this.assessments.add(assessment);
        assessment.getResourceses().add(this);
        return this;
    }

    public Resources removeAssessment(Assessment assessment) {
        this.assessments.remove(assessment);
        assessment.getResourceses().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Resources)) {
            return false;
        }
        return getId() != null && getId().equals(((Resources) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Resources{" +
            "id=" + getId() +
            ", fileName='" + getFileName() + "'" +
            ", document='" + getDocument() + "'" +
            ", documentContentType='" + getDocumentContentType() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
