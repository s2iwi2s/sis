package com.sis.web.rest;

import static com.sis.domain.AccountPayablesAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static com.sis.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.AccountPayables;
import com.sis.repository.AccountPayablesRepository;
import com.sis.service.dto.AccountPayablesDTO;
import com.sis.service.mapper.AccountPayablesMapper;
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
 * Integration tests for the {@link AccountPayablesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountPayablesResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final Integer DEFAULT_PRIORITY = 1;
    private static final Integer UPDATED_PRIORITY = 2;

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_LAST_MODIFIED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LAST_MODIFIED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/account-payables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AccountPayablesRepository accountPayablesRepository;

    @Autowired
    private AccountPayablesMapper accountPayablesMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountPayablesMockMvc;

    private AccountPayables accountPayables;

    private AccountPayables insertedAccountPayables;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountPayables createEntity() {
        return new AccountPayables()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .amount(DEFAULT_AMOUNT)
            .priority(DEFAULT_PRIORITY)
            .active(DEFAULT_ACTIVE)
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
    public static AccountPayables createUpdatedEntity() {
        return new AccountPayables()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .priority(UPDATED_PRIORITY)
            .active(UPDATED_ACTIVE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        accountPayables = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAccountPayables != null) {
            accountPayablesRepository.delete(insertedAccountPayables);
            insertedAccountPayables = null;
        }
    }

    @Test
    @Transactional
    void createAccountPayables() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AccountPayables
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);
        var returnedAccountPayablesDTO = om.readValue(
            restAccountPayablesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accountPayablesDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AccountPayablesDTO.class
        );

        // Validate the AccountPayables in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAccountPayables = accountPayablesMapper.toEntity(returnedAccountPayablesDTO);
        assertAccountPayablesUpdatableFieldsEquals(returnedAccountPayables, getPersistedAccountPayables(returnedAccountPayables));

        insertedAccountPayables = returnedAccountPayables;
    }

    @Test
    @Transactional
    void createAccountPayablesWithExistingId() throws Exception {
        // Create the AccountPayables with an existing ID
        accountPayables.setId(1L);
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountPayablesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accountPayablesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountPayableses() throws Exception {
        // Initialize the database
        insertedAccountPayables = accountPayablesRepository.saveAndFlush(accountPayables);

        // Get all the accountPayablesList
        restAccountPayablesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountPayables.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY)))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getAccountPayables() throws Exception {
        // Initialize the database
        insertedAccountPayables = accountPayablesRepository.saveAndFlush(accountPayables);

        // Get the accountPayables
        restAccountPayablesMockMvc
            .perform(get(ENTITY_API_URL_ID, accountPayables.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountPayables.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAccountPayables() throws Exception {
        // Get the accountPayables
        restAccountPayablesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAccountPayables() throws Exception {
        // Initialize the database
        insertedAccountPayables = accountPayablesRepository.saveAndFlush(accountPayables);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the accountPayables
        AccountPayables updatedAccountPayables = accountPayablesRepository.findById(accountPayables.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAccountPayables are not directly saved in db
        em.detach(updatedAccountPayables);
        updatedAccountPayables
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .priority(UPDATED_PRIORITY)
            .active(UPDATED_ACTIVE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(updatedAccountPayables);

        restAccountPayablesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountPayablesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(accountPayablesDTO))
            )
            .andExpect(status().isOk());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAccountPayablesToMatchAllProperties(updatedAccountPayables);
    }

    @Test
    @Transactional
    void putNonExistingAccountPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accountPayables.setId(longCount.incrementAndGet());

        // Create the AccountPayables
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountPayablesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountPayablesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(accountPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accountPayables.setId(longCount.incrementAndGet());

        // Create the AccountPayables
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountPayablesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(accountPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accountPayables.setId(longCount.incrementAndGet());

        // Create the AccountPayables
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountPayablesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accountPayablesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountPayablesWithPatch() throws Exception {
        // Initialize the database
        insertedAccountPayables = accountPayablesRepository.saveAndFlush(accountPayables);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the accountPayables using partial update
        AccountPayables partialUpdatedAccountPayables = new AccountPayables();
        partialUpdatedAccountPayables.setId(accountPayables.getId());

        partialUpdatedAccountPayables
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .active(UPDATED_ACTIVE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restAccountPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountPayables.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAccountPayables))
            )
            .andExpect(status().isOk());

        // Validate the AccountPayables in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAccountPayablesUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAccountPayables, accountPayables),
            getPersistedAccountPayables(accountPayables)
        );
    }

    @Test
    @Transactional
    void fullUpdateAccountPayablesWithPatch() throws Exception {
        // Initialize the database
        insertedAccountPayables = accountPayablesRepository.saveAndFlush(accountPayables);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the accountPayables using partial update
        AccountPayables partialUpdatedAccountPayables = new AccountPayables();
        partialUpdatedAccountPayables.setId(accountPayables.getId());

        partialUpdatedAccountPayables
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .priority(UPDATED_PRIORITY)
            .active(UPDATED_ACTIVE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAccountPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountPayables.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAccountPayables))
            )
            .andExpect(status().isOk());

        // Validate the AccountPayables in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAccountPayablesUpdatableFieldsEquals(
            partialUpdatedAccountPayables,
            getPersistedAccountPayables(partialUpdatedAccountPayables)
        );
    }

    @Test
    @Transactional
    void patchNonExistingAccountPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accountPayables.setId(longCount.incrementAndGet());

        // Create the AccountPayables
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountPayablesDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(accountPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accountPayables.setId(longCount.incrementAndGet());

        // Create the AccountPayables
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(accountPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accountPayables.setId(longCount.incrementAndGet());

        // Create the AccountPayables
        AccountPayablesDTO accountPayablesDTO = accountPayablesMapper.toDto(accountPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountPayablesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(accountPayablesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountPayables() throws Exception {
        // Initialize the database
        insertedAccountPayables = accountPayablesRepository.saveAndFlush(accountPayables);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the accountPayables
        restAccountPayablesMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountPayables.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return accountPayablesRepository.count();
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

    protected AccountPayables getPersistedAccountPayables(AccountPayables accountPayables) {
        return accountPayablesRepository.findById(accountPayables.getId()).orElseThrow();
    }

    protected void assertPersistedAccountPayablesToMatchAllProperties(AccountPayables expectedAccountPayables) {
        assertAccountPayablesAllPropertiesEquals(expectedAccountPayables, getPersistedAccountPayables(expectedAccountPayables));
    }

    protected void assertPersistedAccountPayablesToMatchUpdatableProperties(AccountPayables expectedAccountPayables) {
        assertAccountPayablesAllUpdatablePropertiesEquals(expectedAccountPayables, getPersistedAccountPayables(expectedAccountPayables));
    }
}
