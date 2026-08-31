package com.sis.web.rest;

import static com.sis.domain.InvoicesAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static com.sis.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.Invoices;
import com.sis.repository.InvoicesRepository;
import com.sis.service.dto.InvoicesDTO;
import com.sis.service.mapper.InvoicesMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link InvoicesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InvoicesResourceIT {

    private static final LocalDate DEFAULT_DUE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DUE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_AMOUNT_PAID = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT_PAID = new BigDecimal(2);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_LAST_MODIFIED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LAST_MODIFIED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/invoices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private InvoicesRepository invoicesRepository;

    @Autowired
    private InvoicesMapper invoicesMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInvoicesMockMvc;

    private Invoices invoices;

    private Invoices insertedInvoices;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Invoices createEntity() {
        return new Invoices()
            .dueDate(DEFAULT_DUE_DATE)
            .amountPaid(DEFAULT_AMOUNT_PAID)
            .status(DEFAULT_STATUS)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Invoices createUpdatedEntity() {
        return new Invoices()
            .dueDate(UPDATED_DUE_DATE)
            .amountPaid(UPDATED_AMOUNT_PAID)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        invoices = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedInvoices != null) {
            invoicesRepository.delete(insertedInvoices);
            insertedInvoices = null;
        }
    }

    @Test
    @Transactional
    void createInvoices() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Invoices
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);
        var returnedInvoicesDTO = om.readValue(
            restInvoicesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(invoicesDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            InvoicesDTO.class
        );

        // Validate the Invoices in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedInvoices = invoicesMapper.toEntity(returnedInvoicesDTO);
        assertInvoicesUpdatableFieldsEquals(returnedInvoices, getPersistedInvoices(returnedInvoices));

        insertedInvoices = returnedInvoices;
    }

    @Test
    @Transactional
    void createInvoicesWithExistingId() throws Exception {
        // Create the Invoices with an existing ID
        invoices.setId(1L);
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInvoicesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(invoicesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInvoiceses() throws Exception {
        // Initialize the database
        insertedInvoices = invoicesRepository.saveAndFlush(invoices);

        // Get all the invoicesList
        restInvoicesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(invoices.getId().intValue())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())))
            .andExpect(jsonPath("$.[*].amountPaid").value(hasItem(sameNumber(DEFAULT_AMOUNT_PAID))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getInvoices() throws Exception {
        // Initialize the database
        insertedInvoices = invoicesRepository.saveAndFlush(invoices);

        // Get the invoices
        restInvoicesMockMvc
            .perform(get(ENTITY_API_URL_ID, invoices.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(invoices.getId().intValue()))
            .andExpect(jsonPath("$.dueDate").value(DEFAULT_DUE_DATE.toString()))
            .andExpect(jsonPath("$.amountPaid").value(sameNumber(DEFAULT_AMOUNT_PAID)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingInvoices() throws Exception {
        // Get the invoices
        restInvoicesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInvoices() throws Exception {
        // Initialize the database
        insertedInvoices = invoicesRepository.saveAndFlush(invoices);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the invoices
        Invoices updatedInvoices = invoicesRepository.findById(invoices.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedInvoices are not directly saved in db
        em.detach(updatedInvoices);
        updatedInvoices
            .dueDate(UPDATED_DUE_DATE)
            .amountPaid(UPDATED_AMOUNT_PAID)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(updatedInvoices);

        restInvoicesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, invoicesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(invoicesDTO))
            )
            .andExpect(status().isOk());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedInvoicesToMatchAllProperties(updatedInvoices);
    }

    @Test
    @Transactional
    void putNonExistingInvoices() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        invoices.setId(longCount.incrementAndGet());

        // Create the Invoices
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInvoicesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, invoicesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(invoicesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInvoices() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        invoices.setId(longCount.incrementAndGet());

        // Create the Invoices
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvoicesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(invoicesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInvoices() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        invoices.setId(longCount.incrementAndGet());

        // Create the Invoices
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvoicesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(invoicesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInvoicesWithPatch() throws Exception {
        // Initialize the database
        insertedInvoices = invoicesRepository.saveAndFlush(invoices);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the invoices using partial update
        Invoices partialUpdatedInvoices = new Invoices();
        partialUpdatedInvoices.setId(invoices.getId());

        partialUpdatedInvoices.status(UPDATED_STATUS).lastModifiedBy(UPDATED_LAST_MODIFIED_BY).lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restInvoicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInvoices.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedInvoices))
            )
            .andExpect(status().isOk());

        // Validate the Invoices in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertInvoicesUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedInvoices, invoices), getPersistedInvoices(invoices));
    }

    @Test
    @Transactional
    void fullUpdateInvoicesWithPatch() throws Exception {
        // Initialize the database
        insertedInvoices = invoicesRepository.saveAndFlush(invoices);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the invoices using partial update
        Invoices partialUpdatedInvoices = new Invoices();
        partialUpdatedInvoices.setId(invoices.getId());

        partialUpdatedInvoices
            .dueDate(UPDATED_DUE_DATE)
            .amountPaid(UPDATED_AMOUNT_PAID)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restInvoicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInvoices.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedInvoices))
            )
            .andExpect(status().isOk());

        // Validate the Invoices in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertInvoicesUpdatableFieldsEquals(partialUpdatedInvoices, getPersistedInvoices(partialUpdatedInvoices));
    }

    @Test
    @Transactional
    void patchNonExistingInvoices() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        invoices.setId(longCount.incrementAndGet());

        // Create the Invoices
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInvoicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, invoicesDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(invoicesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInvoices() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        invoices.setId(longCount.incrementAndGet());

        // Create the Invoices
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvoicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(invoicesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInvoices() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        invoices.setId(longCount.incrementAndGet());

        // Create the Invoices
        InvoicesDTO invoicesDTO = invoicesMapper.toDto(invoices);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvoicesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(invoicesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Invoices in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInvoices() throws Exception {
        // Initialize the database
        insertedInvoices = invoicesRepository.saveAndFlush(invoices);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the invoices
        restInvoicesMockMvc
            .perform(delete(ENTITY_API_URL_ID, invoices.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return invoicesRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Invoices getPersistedInvoices(Invoices invoices) {
        return invoicesRepository.findById(invoices.getId()).orElseThrow();
    }

    protected void assertPersistedInvoicesToMatchAllProperties(Invoices expectedInvoices) {
        assertInvoicesAllPropertiesEquals(expectedInvoices, getPersistedInvoices(expectedInvoices));
    }

    protected void assertPersistedInvoicesToMatchUpdatableProperties(Invoices expectedInvoices) {
        assertInvoicesAllUpdatablePropertiesEquals(expectedInvoices, getPersistedInvoices(expectedInvoices));
    }
}
