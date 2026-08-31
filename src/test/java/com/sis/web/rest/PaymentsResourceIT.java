package com.sis.web.rest;

import static com.sis.domain.PaymentsAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static com.sis.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.Payments;
import com.sis.repository.PaymentsRepository;
import com.sis.service.dto.PaymentsDTO;
import com.sis.service.mapper.PaymentsMapper;
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
 * Integration tests for the {@link PaymentsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PaymentsResourceIT {

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String DEFAULT_TRANSACTION_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_TRANSACTION_REFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_LAST_MODIFIED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LAST_MODIFIED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/payments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PaymentsRepository paymentsRepository;

    @Autowired
    private PaymentsMapper paymentsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaymentsMockMvc;

    private Payments payments;

    private Payments insertedPayments;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Payments createEntity() {
        return new Payments()
            .amount(DEFAULT_AMOUNT)
            .transactionReference(DEFAULT_TRANSACTION_REFERENCE)
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
    public static Payments createUpdatedEntity() {
        return new Payments()
            .amount(UPDATED_AMOUNT)
            .transactionReference(UPDATED_TRANSACTION_REFERENCE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        payments = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedPayments != null) {
            paymentsRepository.delete(insertedPayments);
            insertedPayments = null;
        }
    }

    @Test
    @Transactional
    void createPayments() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Payments
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);
        var returnedPaymentsDTO = om.readValue(
            restPaymentsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paymentsDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PaymentsDTO.class
        );

        // Validate the Payments in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedPayments = paymentsMapper.toEntity(returnedPaymentsDTO);
        assertPaymentsUpdatableFieldsEquals(returnedPayments, getPersistedPayments(returnedPayments));

        insertedPayments = returnedPayments;
    }

    @Test
    @Transactional
    void createPaymentsWithExistingId() throws Exception {
        // Create the Payments with an existing ID
        payments.setId(1L);
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paymentsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPaymentses() throws Exception {
        // Initialize the database
        insertedPayments = paymentsRepository.saveAndFlush(payments);

        // Get all the paymentsList
        restPaymentsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(payments.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))))
            .andExpect(jsonPath("$.[*].transactionReference").value(hasItem(DEFAULT_TRANSACTION_REFERENCE)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getPayments() throws Exception {
        // Initialize the database
        insertedPayments = paymentsRepository.saveAndFlush(payments);

        // Get the payments
        restPaymentsMockMvc
            .perform(get(ENTITY_API_URL_ID, payments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(payments.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.transactionReference").value(DEFAULT_TRANSACTION_REFERENCE))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPayments() throws Exception {
        // Get the payments
        restPaymentsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPayments() throws Exception {
        // Initialize the database
        insertedPayments = paymentsRepository.saveAndFlush(payments);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the payments
        Payments updatedPayments = paymentsRepository.findById(payments.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPayments are not directly saved in db
        em.detach(updatedPayments);
        updatedPayments
            .amount(UPDATED_AMOUNT)
            .transactionReference(UPDATED_TRANSACTION_REFERENCE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(updatedPayments);

        restPaymentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, paymentsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(paymentsDTO))
            )
            .andExpect(status().isOk());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPaymentsToMatchAllProperties(updatedPayments);
    }

    @Test
    @Transactional
    void putNonExistingPayments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payments.setId(longCount.incrementAndGet());

        // Create the Payments
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, paymentsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(paymentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPayments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payments.setId(longCount.incrementAndGet());

        // Create the Payments
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(paymentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPayments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payments.setId(longCount.incrementAndGet());

        // Create the Payments
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(paymentsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePaymentsWithPatch() throws Exception {
        // Initialize the database
        insertedPayments = paymentsRepository.saveAndFlush(payments);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the payments using partial update
        Payments partialUpdatedPayments = new Payments();
        partialUpdatedPayments.setId(payments.getId());

        partialUpdatedPayments
            .amount(UPDATED_AMOUNT)
            .transactionReference(UPDATED_TRANSACTION_REFERENCE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);

        restPaymentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPayments.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPayments))
            )
            .andExpect(status().isOk());

        // Validate the Payments in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPaymentsUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPayments, payments), getPersistedPayments(payments));
    }

    @Test
    @Transactional
    void fullUpdatePaymentsWithPatch() throws Exception {
        // Initialize the database
        insertedPayments = paymentsRepository.saveAndFlush(payments);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the payments using partial update
        Payments partialUpdatedPayments = new Payments();
        partialUpdatedPayments.setId(payments.getId());

        partialUpdatedPayments
            .amount(UPDATED_AMOUNT)
            .transactionReference(UPDATED_TRANSACTION_REFERENCE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restPaymentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPayments.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPayments))
            )
            .andExpect(status().isOk());

        // Validate the Payments in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPaymentsUpdatableFieldsEquals(partialUpdatedPayments, getPersistedPayments(partialUpdatedPayments));
    }

    @Test
    @Transactional
    void patchNonExistingPayments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payments.setId(longCount.incrementAndGet());

        // Create the Payments
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, paymentsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(paymentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPayments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payments.setId(longCount.incrementAndGet());

        // Create the Payments
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(paymentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPayments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payments.setId(longCount.incrementAndGet());

        // Create the Payments
        PaymentsDTO paymentsDTO = paymentsMapper.toDto(payments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(paymentsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Payments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePayments() throws Exception {
        // Initialize the database
        insertedPayments = paymentsRepository.saveAndFlush(payments);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the payments
        restPaymentsMockMvc
            .perform(delete(ENTITY_API_URL_ID, payments.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return paymentsRepository.count();
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

    protected Payments getPersistedPayments(Payments payments) {
        return paymentsRepository.findById(payments.getId()).orElseThrow();
    }

    protected void assertPersistedPaymentsToMatchAllProperties(Payments expectedPayments) {
        assertPaymentsAllPropertiesEquals(expectedPayments, getPersistedPayments(expectedPayments));
    }

    protected void assertPersistedPaymentsToMatchUpdatableProperties(Payments expectedPayments) {
        assertPaymentsAllUpdatablePropertiesEquals(expectedPayments, getPersistedPayments(expectedPayments));
    }
}
