package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.sis.domain.Payments} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PaymentsDTO implements Serializable {

    private Long id;

    private BigDecimal amount;

    @Size(max = 255)
    private String transactionReference;

    @Size(max = 50)
    private String createdBy;

    private LocalDate createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private LocalDate lastModifiedDate;

    private AppConfigDTO method;

    private InvoicesDTO invoices;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
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

    public AppConfigDTO getMethod() {
        return method;
    }

    public void setMethod(AppConfigDTO method) {
        this.method = method;
    }

    public InvoicesDTO getInvoices() {
        return invoices;
    }

    public void setInvoices(InvoicesDTO invoices) {
        this.invoices = invoices;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PaymentsDTO)) {
            return false;
        }

        PaymentsDTO paymentsDTO = (PaymentsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, paymentsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PaymentsDTO{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", transactionReference='" + getTransactionReference() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", method=" + getMethod() +
            ", invoices=" + getInvoices() +
            "}";
    }
}
