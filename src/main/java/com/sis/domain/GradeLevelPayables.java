package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GradeLevelPayables.
 */
@Entity
@Table(name = "grade_level_payables")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GradeLevelPayables implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "active")
    private Boolean active;

    @JsonIgnoreProperties(
        value = { "instructor", "student", "course", "classSchedule", "gradeLevelPayables", "payments" },
        allowSetters = true
    )
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private AppConfig gradelevel;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "gradeLevelPayables")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "invoices", "gradeLevelPayables" }, allowSetters = true)
    private Set<AccountPayables> accountPayableses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GradeLevelPayables id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getActive() {
        return this.active;
    }

    public GradeLevelPayables active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public AppConfig getGradelevel() {
        return this.gradelevel;
    }

    public void setGradelevel(AppConfig appConfig) {
        this.gradelevel = appConfig;
    }

    public GradeLevelPayables gradelevel(AppConfig appConfig) {
        this.setGradelevel(appConfig);
        return this;
    }

    public Set<AccountPayables> getAccountPayableses() {
        return this.accountPayableses;
    }

    public void setAccountPayableses(Set<AccountPayables> accountPayableses) {
        if (this.accountPayableses != null) {
            this.accountPayableses.forEach(i -> i.setGradeLevelPayables(null));
        }
        if (accountPayableses != null) {
            accountPayableses.forEach(i -> i.setGradeLevelPayables(this));
        }
        this.accountPayableses = accountPayableses;
    }

    public GradeLevelPayables accountPayableses(Set<AccountPayables> accountPayableses) {
        this.setAccountPayableses(accountPayableses);
        return this;
    }

    public GradeLevelPayables addAccountPayables(AccountPayables accountPayables) {
        this.accountPayableses.add(accountPayables);
        accountPayables.setGradeLevelPayables(this);
        return this;
    }

    public GradeLevelPayables removeAccountPayables(AccountPayables accountPayables) {
        this.accountPayableses.remove(accountPayables);
        accountPayables.setGradeLevelPayables(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GradeLevelPayables)) {
            return false;
        }
        return getId() != null && getId().equals(((GradeLevelPayables) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GradeLevelPayables{" +
            "id=" + getId() +
            ", active='" + getActive() + "'" +
            "}";
    }
}
