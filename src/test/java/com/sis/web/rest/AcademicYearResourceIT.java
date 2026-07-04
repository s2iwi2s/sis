package com.sis.web.rest;

import static com.sis.domain.AcademicYearAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.AcademicYear;
import com.sis.repository.AcademicYearRepository;
import com.sis.service.dto.AcademicYearDTO;
import com.sis.service.mapper.AcademicYearMapper;
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
 * Integration tests for the {@link AcademicYearResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AcademicYearResourceIT {

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

    private static final String ENTITY_API_URL = "/api/academic-years";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @Autowired
    private AcademicYearMapper academicYearMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAcademicYearMockMvc;

    private AcademicYear academicYear;

    private AcademicYear insertedAcademicYear;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AcademicYear createEntity() {
        return new AcademicYear()
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
    public static AcademicYear createUpdatedEntity() {
        return new AcademicYear()
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
        academicYear = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAcademicYear != null) {
            academicYearRepository.delete(insertedAcademicYear);
            insertedAcademicYear = null;
        }
    }

    @Test
    @Transactional
    void createAcademicYear() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AcademicYear
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);
        var returnedAcademicYearDTO = om.readValue(
            restAcademicYearMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(academicYearDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AcademicYearDTO.class
        );

        // Validate the AcademicYear in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAcademicYear = academicYearMapper.toEntity(returnedAcademicYearDTO);
        assertAcademicYearUpdatableFieldsEquals(returnedAcademicYear, getPersistedAcademicYear(returnedAcademicYear));

        insertedAcademicYear = returnedAcademicYear;
    }

    @Test
    @Transactional
    void createAcademicYearWithExistingId() throws Exception {
        // Create the AcademicYear with an existing ID
        academicYear.setId(1L);
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAcademicYearMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(academicYearDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAcademicYears() throws Exception {
        // Initialize the database
        insertedAcademicYear = academicYearRepository.saveAndFlush(academicYear);

        // Get all the academicYearList
        restAcademicYearMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(academicYear.getId().intValue())))
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
    void getAcademicYear() throws Exception {
        // Initialize the database
        insertedAcademicYear = academicYearRepository.saveAndFlush(academicYear);

        // Get the academicYear
        restAcademicYearMockMvc
            .perform(get(ENTITY_API_URL_ID, academicYear.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(academicYear.getId().intValue()))
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
    void getNonExistingAcademicYear() throws Exception {
        // Get the academicYear
        restAcademicYearMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAcademicYear() throws Exception {
        // Initialize the database
        insertedAcademicYear = academicYearRepository.saveAndFlush(academicYear);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the academicYear
        AcademicYear updatedAcademicYear = academicYearRepository.findById(academicYear.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAcademicYear are not directly saved in db
        em.detach(updatedAcademicYear);
        updatedAcademicYear
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .current(UPDATED_CURRENT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(updatedAcademicYear);

        restAcademicYearMockMvc
            .perform(
                put(ENTITY_API_URL_ID, academicYearDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(academicYearDTO))
            )
            .andExpect(status().isOk());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAcademicYearToMatchAllProperties(updatedAcademicYear);
    }

    @Test
    @Transactional
    void putNonExistingAcademicYear() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicYear.setId(longCount.incrementAndGet());

        // Create the AcademicYear
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcademicYearMockMvc
            .perform(
                put(ENTITY_API_URL_ID, academicYearDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(academicYearDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAcademicYear() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicYear.setId(longCount.incrementAndGet());

        // Create the AcademicYear
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicYearMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(academicYearDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAcademicYear() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicYear.setId(longCount.incrementAndGet());

        // Create the AcademicYear
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicYearMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(academicYearDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAcademicYearWithPatch() throws Exception {
        // Initialize the database
        insertedAcademicYear = academicYearRepository.saveAndFlush(academicYear);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the academicYear using partial update
        AcademicYear partialUpdatedAcademicYear = new AcademicYear();
        partialUpdatedAcademicYear.setId(academicYear.getId());

        partialUpdatedAcademicYear
            .code(UPDATED_CODE)
            .current(UPDATED_CURRENT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restAcademicYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcademicYear.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAcademicYear))
            )
            .andExpect(status().isOk());

        // Validate the AcademicYear in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAcademicYearUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAcademicYear, academicYear),
            getPersistedAcademicYear(academicYear)
        );
    }

    @Test
    @Transactional
    void fullUpdateAcademicYearWithPatch() throws Exception {
        // Initialize the database
        insertedAcademicYear = academicYearRepository.saveAndFlush(academicYear);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the academicYear using partial update
        AcademicYear partialUpdatedAcademicYear = new AcademicYear();
        partialUpdatedAcademicYear.setId(academicYear.getId());

        partialUpdatedAcademicYear
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .current(UPDATED_CURRENT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAcademicYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcademicYear.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAcademicYear))
            )
            .andExpect(status().isOk());

        // Validate the AcademicYear in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAcademicYearUpdatableFieldsEquals(partialUpdatedAcademicYear, getPersistedAcademicYear(partialUpdatedAcademicYear));
    }

    @Test
    @Transactional
    void patchNonExistingAcademicYear() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicYear.setId(longCount.incrementAndGet());

        // Create the AcademicYear
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcademicYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, academicYearDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(academicYearDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAcademicYear() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicYear.setId(longCount.incrementAndGet());

        // Create the AcademicYear
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(academicYearDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAcademicYear() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        academicYear.setId(longCount.incrementAndGet());

        // Create the AcademicYear
        AcademicYearDTO academicYearDTO = academicYearMapper.toDto(academicYear);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcademicYearMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(academicYearDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AcademicYear in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAcademicYear() throws Exception {
        // Initialize the database
        insertedAcademicYear = academicYearRepository.saveAndFlush(academicYear);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the academicYear
        restAcademicYearMockMvc
            .perform(delete(ENTITY_API_URL_ID, academicYear.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return academicYearRepository.count();
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

    protected AcademicYear getPersistedAcademicYear(AcademicYear academicYear) {
        return academicYearRepository.findById(academicYear.getId()).orElseThrow();
    }

    protected void assertPersistedAcademicYearToMatchAllProperties(AcademicYear expectedAcademicYear) {
        assertAcademicYearAllPropertiesEquals(expectedAcademicYear, getPersistedAcademicYear(expectedAcademicYear));
    }

    protected void assertPersistedAcademicYearToMatchUpdatableProperties(AcademicYear expectedAcademicYear) {
        assertAcademicYearAllUpdatablePropertiesEquals(expectedAcademicYear, getPersistedAcademicYear(expectedAcademicYear));
    }
}
