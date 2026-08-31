package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.AccountPayables} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AccountPayablesDTO implements Serializable {

    private Long id;

    @Size(max = 25)
    private String name;

    @Size(max = 50)
    private String description;

    private BigDecimal amount;

    private Integer priority;

    private Boolean active;

    @Size(max = 50)
    private String createdBy;

    private LocalDate createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private LocalDate lastModifiedDate;

    private InvoicesDTO invoices;

    private GradeLevelPayablesDTO gradeLevelPayables;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public LocalDate getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDate lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public InvoicesDTO getInvoices() {
        return invoices;
    }

    public void setInvoices(InvoicesDTO invoices) {
        this.invoices = invoices;
    }

    public GradeLevelPayablesDTO getGradeLevelPayables() {
        return gradeLevelPayables;
    }

    public void setGradeLevelPayables(GradeLevelPayablesDTO gradeLevelPayables) {
        this.gradeLevelPayables = gradeLevelPayables;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AccountPayablesDTO)) {
            return false;
        }

        AccountPayablesDTO accountPayablesDTO = (AccountPayablesDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, accountPayablesDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AccountPayablesDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", amount=" + getAmount() +
            ", priority=" + getPriority() +
            ", active='" + getActive() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", invoices=" + getInvoices() +
            ", gradeLevelPayables=" + getGradeLevelPayables() +
            "}";
    }
}
