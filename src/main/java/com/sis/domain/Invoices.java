package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Invoices.
 */
@Entity
@Table(name = "invoices")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Invoices implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "amount_paid", precision = 21, scale = 2)
    private BigDecimal amountPaid;

    @Size(max = 10)
    @Column(name = "status", length = 10)
    private String status;

    @Size(max = 50)
    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Size(max = 50)
    @Column(name = "last_modified_by", length = 50)
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private LocalDate lastModifiedDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "invoices")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "invoices", "gradeLevelPayables" }, allowSetters = true)
    private Set<AccountPayables> accountPayableses = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "invoices")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "method", "invoices" }, allowSetters = true)
    private Set<Payments> paymentses = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "gender", "user", "invoiceses", "courseSchedules", "enrollments" }, allowSetters = true)
    private Student student;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Invoices id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public Invoices dueDate(LocalDate dueDate) {
        this.setDueDate(dueDate);
        return this;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getAmountPaid() {
        return this.amountPaid;
    }

    public Invoices amountPaid(BigDecimal amountPaid) {
        this.setAmountPaid(amountPaid);
        return this;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getStatus() {
        return this.status;
    }

    public Invoices status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Invoices createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Invoices createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return this.lastModifiedBy;
    }

    public Invoices lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public LocalDate getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Invoices lastModifiedDate(LocalDate lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public void setLastModifiedDate(LocalDate lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<AccountPayables> getAccountPayableses() {
        return this.accountPayableses;
    }

    public void setAccountPayableses(Set<AccountPayables> accountPayableses) {
        if (this.accountPayableses != null) {
            this.accountPayableses.forEach(i -> i.setInvoices(null));
        }
        if (accountPayableses != null) {
            accountPayableses.forEach(i -> i.setInvoices(this));
        }
        this.accountPayableses = accountPayableses;
    }

    public Invoices accountPayableses(Set<AccountPayables> accountPayableses) {
        this.setAccountPayableses(accountPayableses);
        return this;
    }

    public Invoices addAccountPayables(AccountPayables accountPayables) {
        this.accountPayableses.add(accountPayables);
        accountPayables.setInvoices(this);
        return this;
    }

    public Invoices removeAccountPayables(AccountPayables accountPayables) {
        this.accountPayableses.remove(accountPayables);
        accountPayables.setInvoices(null);
        return this;
    }

    public Set<Payments> getPaymentses() {
        return this.paymentses;
    }

    public void setPaymentses(Set<Payments> paymentses) {
        if (this.paymentses != null) {
            this.paymentses.forEach(i -> i.setInvoices(null));
        }
        if (paymentses != null) {
            paymentses.forEach(i -> i.setInvoices(this));
        }
        this.paymentses = paymentses;
    }

    public Invoices paymentses(Set<Payments> paymentses) {
        this.setPaymentses(paymentses);
        return this;
    }

    public Invoices addPayments(Payments payments) {
        this.paymentses.add(payments);
        payments.setInvoices(this);
        return this;
    }

    public Invoices removePayments(Payments payments) {
        this.paymentses.remove(payments);
        payments.setInvoices(null);
        return this;
    }

    public Student getStudent() {
        return this.student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Invoices student(Student student) {
        this.setStudent(student);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Invoices)) {
            return false;
        }
        return getId() != null && getId().equals(((Invoices) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Invoices{" +
            "id=" + getId() +
            ", dueDate='" + getDueDate() + "'" +
            ", amountPaid=" + getAmountPaid() +
            ", status='" + getStatus() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
