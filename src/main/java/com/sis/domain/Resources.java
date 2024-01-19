package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
public class Resources extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resources")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "resources", "learningCompetency" }, allowSetters = true)
    private Set<Strategies> strategies = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "resources")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "resources", "learningCompetency" }, allowSetters = true)
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

    public Resources createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public Resources createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public Resources lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public Resources lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public Set<Strategies> getStrategies() {
        return this.strategies;
    }

    public void setStrategies(Set<Strategies> strategies) {
        if (this.strategies != null) {
            this.strategies.forEach(i -> i.removeResources(this));
        }
        if (strategies != null) {
            strategies.forEach(i -> i.addResources(this));
        }
        this.strategies = strategies;
    }

    public Resources strategies(Set<Strategies> strategies) {
        this.setStrategies(strategies);
        return this;
    }

    public Resources addStrategies(Strategies strategies) {
        this.strategies.add(strategies);
        strategies.getResources().add(this);
        return this;
    }

    public Resources removeStrategies(Strategies strategies) {
        this.strategies.remove(strategies);
        strategies.getResources().remove(this);
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
        assessment.getResources().add(this);
        return this;
    }

    public Resources removeAssessment(Assessment assessment) {
        this.assessments.remove(assessment);
        assessment.getResources().remove(this);
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
            ", documentContentType='" + getDocumentContentType() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
