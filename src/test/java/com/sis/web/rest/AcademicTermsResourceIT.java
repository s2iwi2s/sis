package com.sis.web.rest;

import static com.sis.domain.AcademicTermsAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.AcademicTerms;
import com.sis.repository.AcademicTermsRepository;
import com.sis.service.dto.AcademicTermsDTO;
import com.sis.service.mapper.AcademicTermsMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link AcademicTermsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AcademicTermsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_CURRENT = false;
    private static final Boolean UPDATED_CURRENT = true;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/academic-terms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AcademicTermsRepository academicTermsRepository;

    @Autowired
    private AcademicTermsMapper academicTermsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAcademicTermsMockMvc;

    private AcademicTerms academicTerms;

    private AcademicTerms insertedAcademicTerms;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AcademicTerms createEntity() {
        return new AcademicTerms()
            .name(DEFAULT_NAME)
            .code(DEFAULT_CODE)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .current(DEFAULT_CURRENT)
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
    public static AcademicTerms createUpdatedEntity() {
        return new AcademicTerms()
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .current(UPDATED_CURRENT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        academicTerms = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAcademicTerms != null) {
            academicTermsRepository.delete(insertedAcademicTerms);
            insertedAcademicTerms = null;
        }
    }

    @Test
    @Transactional
    void createAcademicTerms() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AcademicTerms
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);
        var returnedAcademicTermsDTO = om.readValue(
            restAcademicTermsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(academicTermsDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AcademicTermsDTO.class
        );

        // Validate the AcademicTerms in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAcademicTerms = academicTermsMapper.toEntity(returnedAcademicTermsDTO);
        assertAcademicTermsUpdatableFieldsEquals(returnedAcademicTerms, getPersistedAcademicTerms(returnedAcademicTerms));

        insertedAcademicTerms = returnedAcademicTerms;
    }

    @Test
    @Transactional
    void createAcademicTermsWithExistingId() throws Exception {
        // Create the AcademicTerms with an existing ID
        academicTerms.setId(1L);
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAcademicTermsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(academicTermsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAcademicTermses() throws Exception {
        // Initialize the database
        insertedAcademicTerms = academicTermsRepository.saveAndFlush(academicTerms);

        // Get all the academicTermsList
        restAcademicTermsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(academicTerms.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].current").value(hasItem(DEFAULT_CURRENT)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getAcademicTerms() throws Exception {
        // Initialize the database
        insertedAcademicTerms = academicTermsRepository.saveAndFlush(academicTerms);

        // Get the academicTerms
        restAcademicTermsMockMvc
            .perform(get(ENTITY_API_URL_ID, academicTerms.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(academicTerms.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.current").value(DEFAULT_CURRENT))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAcademicTerms() throws Exception {
        // Get the academicTerms
        restAcademicTermsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAcademicTerms() throws Exception {
        // Initialize the database
        insertedAcademicTerms = academicTermsRepository.saveAndFlush(academicTerms);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the academicTerms
        AcademicTerms updatedAcademicTerms = academicTermsRepository.findById(academicTerms.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAcademicTerms are not directly saved in db
        em.detach(updatedAcademicTerms);
        updatedAcademicTerms
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .current(UPDATED_CURRENT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(updatedAcademicTerms);

        restAcademicTermsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, academicTermsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(academicTermsDTO))
            )
            .andExpect(status().isOk());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAcademicTermsToMatchAllProperties(updatedAcademicTerms);
    }

    @Test
    @Transactional
    void putNonExistingAcademicTerms() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicTerms.setId(longCount.incrementAndGet());

        // Create the AcademicTerms
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcademicTermsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, academicTermsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(academicTermsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAcademicTerms() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicTerms.setId(longCount.incrementAndGet());

        // Create the AcademicTerms
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicTermsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(academicTermsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAcademicTerms() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicTerms.setId(longCount.incrementAndGet());

        // Create the AcademicTerms
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicTermsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(academicTermsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAcademicTermsWithPatch() throws Exception {
        // Initialize the database
        insertedAcademicTerms = academicTermsRepository.saveAndFlush(academicTerms);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the academicTerms using partial update
        AcademicTerms partialUpdatedAcademicTerms = new AcademicTerms();
        partialUpdatedAcademicTerms.setId(academicTerms.getId());

        partialUpdatedAcademicTerms
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAcademicTermsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcademicTerms.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAcademicTerms))
            )
            .andExpect(status().isOk());

        // Validate the AcademicTerms in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAcademicTermsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAcademicTerms, academicTerms),
            getPersistedAcademicTerms(academicTerms)
        );
    }

    @Test
    @Transactional
    void fullUpdateAcademicTermsWithPatch() throws Exception {
        // Initialize the database
        insertedAcademicTerms = academicTermsRepository.saveAndFlush(academicTerms);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the academicTerms using partial update
        AcademicTerms partialUpdatedAcademicTerms = new AcademicTerms();
        partialUpdatedAcademicTerms.setId(academicTerms.getId());

        partialUpdatedAcademicTerms
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .current(UPDATED_CURRENT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAcademicTermsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcademicTerms.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAcademicTerms))
            )
            .andExpect(status().isOk());

        // Validate the AcademicTerms in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAcademicTermsUpdatableFieldsEquals(partialUpdatedAcademicTerms, getPersistedAcademicTerms(partialUpdatedAcademicTerms));
    }

    @Test
    @Transactional
    void patchNonExistingAcademicTerms() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicTerms.setId(longCount.incrementAndGet());

        // Create the AcademicTerms
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcademicTermsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, academicTermsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(academicTermsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAcademicTerms() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicTerms.setId(longCount.incrementAndGet());

        // Create the AcademicTerms
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicTermsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(academicTermsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAcademicTerms() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicTerms.setId(longCount.incrementAndGet());

        // Create the AcademicTerms
        AcademicTermsDTO academicTermsDTO = academicTermsMapper.toDto(academicTerms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicTermsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(academicTermsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AcademicTerms in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAcademicTerms() throws Exception {
        // Initialize the database
        insertedAcademicTerms = academicTermsRepository.saveAndFlush(academicTerms);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the academicTerms
        restAcademicTermsMockMvc
            .perform(delete(ENTITY_API_URL_ID, academicTerms.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return academicTermsRepository.count();
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

    protected AcademicTerms getPersistedAcademicTerms(AcademicTerms academicTerms) {
        return academicTermsRepository.findById(academicTerms.getId()).orElseThrow();
    }

    protected void assertPersistedAcademicTermsToMatchAllProperties(AcademicTerms expectedAcademicTerms) {
        assertAcademicTermsAllPropertiesEquals(expectedAcademicTerms, getPersistedAcademicTerms(expectedAcademicTerms));
    }

    protected void assertPersistedAcademicTermsToMatchUpdatableProperties(AcademicTerms expectedAcademicTerms) {
        assertAcademicTermsAllUpdatablePropertiesEquals(expectedAcademicTerms, getPersistedAcademicTerms(expectedAcademicTerms));
    }
}
