package com.sis.web.rest;

import static com.sis.domain.LearningCompetencyAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.LearningCompetency;
import com.sis.repository.LearningCompetencyRepository;
import com.sis.service.dto.LearningCompetencyDTO;
import com.sis.service.mapper.LearningCompetencyMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
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
 * Integration tests for the {@link LearningCompetencyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LearningCompetencyResourceIT {

    private static final Integer DEFAULT_SEQ_NO = 1;
    private static final Integer UPDATED_SEQ_NO = 2;

    private static final String DEFAULT_COMPETENCY_CODE = "AAAAAAAAAA";
    private static final String UPDATED_COMPETENCY_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/learning-competencies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LearningCompetencyRepository learningCompetencyRepository;

    @Autowired
    private LearningCompetencyMapper learningCompetencyMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLearningCompetencyMockMvc;

    private LearningCompetency learningCompetency;

    private LearningCompetency insertedLearningCompetency;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LearningCompetency createEntity() {
        return new LearningCompetency()
            .seqNo(DEFAULT_SEQ_NO)
            .competencyCode(DEFAULT_COMPETENCY_CODE)
            .description(DEFAULT_DESCRIPTION)
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
    public static LearningCompetency createUpdatedEntity() {
        return new LearningCompetency()
            .seqNo(UPDATED_SEQ_NO)
            .competencyCode(UPDATED_COMPETENCY_CODE)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        learningCompetency = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedLearningCompetency != null) {
            learningCompetencyRepository.delete(insertedLearningCompetency);
            insertedLearningCompetency = null;
        }
    }

    @Test
    @Transactional
    void createLearningCompetency() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);
        var returnedLearningCompetencyDTO = om.readValue(
            restLearningCompetencyMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(learningCompetencyDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            LearningCompetencyDTO.class
        );

        // Validate the LearningCompetency in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedLearningCompetency = learningCompetencyMapper.toEntity(returnedLearningCompetencyDTO);
        assertLearningCompetencyUpdatableFieldsEquals(
            returnedLearningCompetency,
            getPersistedLearningCompetency(returnedLearningCompetency)
        );

        insertedLearningCompetency = returnedLearningCompetency;
    }

    @Test
    @Transactional
    void createLearningCompetencyWithExistingId() throws Exception {
        // Create the LearningCompetency with an existing ID
        learningCompetency.setId(1L);
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLearningCompetencyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(learningCompetencyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLearningCompetencies() throws Exception {
        // Initialize the database
        insertedLearningCompetency = learningCompetencyRepository.saveAndFlush(learningCompetency);

        // Get all the learningCompetencyList
        restLearningCompetencyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(learningCompetency.getId().intValue())))
            .andExpect(jsonPath("$.[*].seqNo").value(hasItem(DEFAULT_SEQ_NO)))
            .andExpect(jsonPath("$.[*].competencyCode").value(hasItem(DEFAULT_COMPETENCY_CODE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getLearningCompetency() throws Exception {
        // Initialize the database
        insertedLearningCompetency = learningCompetencyRepository.saveAndFlush(learningCompetency);

        // Get the learningCompetency
        restLearningCompetencyMockMvc
            .perform(get(ENTITY_API_URL_ID, learningCompetency.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(learningCompetency.getId().intValue()))
            .andExpect(jsonPath("$.seqNo").value(DEFAULT_SEQ_NO))
            .andExpect(jsonPath("$.competencyCode").value(DEFAULT_COMPETENCY_CODE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLearningCompetency() throws Exception {
        // Get the learningCompetency
        restLearningCompetencyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLearningCompetency() throws Exception {
        // Initialize the database
        insertedLearningCompetency = learningCompetencyRepository.saveAndFlush(learningCompetency);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the learningCompetency
        LearningCompetency updatedLearningCompetency = learningCompetencyRepository.findById(learningCompetency.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLearningCompetency are not directly saved in db
        em.detach(updatedLearningCompetency);
        updatedLearningCompetency
            .seqNo(UPDATED_SEQ_NO)
            .competencyCode(UPDATED_COMPETENCY_CODE)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(updatedLearningCompetency);

        restLearningCompetencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, learningCompetencyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(learningCompetencyDTO))
            )
            .andExpect(status().isOk());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLearningCompetencyToMatchAllProperties(updatedLearningCompetency);
    }

    @Test
    @Transactional
    void putNonExistingLearningCompetency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, learningCompetencyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLearningCompetency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLearningCompetency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(learningCompetencyDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLearningCompetencyWithPatch() throws Exception {
        // Initialize the database
        insertedLearningCompetency = learningCompetencyRepository.saveAndFlush(learningCompetency);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the learningCompetency using partial update
        LearningCompetency partialUpdatedLearningCompetency = new LearningCompetency();
        partialUpdatedLearningCompetency.setId(learningCompetency.getId());

        partialUpdatedLearningCompetency
            .competencyCode(UPDATED_COMPETENCY_CODE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearningCompetency.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLearningCompetency))
            )
            .andExpect(status().isOk());

        // Validate the LearningCompetency in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLearningCompetencyUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedLearningCompetency, learningCompetency),
            getPersistedLearningCompetency(learningCompetency)
        );
    }

    @Test
    @Transactional
    void fullUpdateLearningCompetencyWithPatch() throws Exception {
        // Initialize the database
        insertedLearningCompetency = learningCompetencyRepository.saveAndFlush(learningCompetency);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the learningCompetency using partial update
        LearningCompetency partialUpdatedLearningCompetency = new LearningCompetency();
        partialUpdatedLearningCompetency.setId(learningCompetency.getId());

        partialUpdatedLearningCompetency
            .seqNo(UPDATED_SEQ_NO)
            .competencyCode(UPDATED_COMPETENCY_CODE)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearningCompetency.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLearningCompetency))
            )
            .andExpect(status().isOk());

        // Validate the LearningCompetency in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLearningCompetencyUpdatableFieldsEquals(
            partialUpdatedLearningCompetency,
            getPersistedLearningCompetency(partialUpdatedLearningCompetency)
        );
    }

    @Test
    @Transactional
    void patchNonExistingLearningCompetency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, learningCompetencyDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLearningCompetency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLearningCompetency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(learningCompetencyDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LearningCompetency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLearningCompetency() throws Exception {
        // Initialize the database
        insertedLearningCompetency = learningCompetencyRepository.saveAndFlush(learningCompetency);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the learningCompetency
        restLearningCompetencyMockMvc
            .perform(delete(ENTITY_API_URL_ID, learningCompetency.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return learningCompetencyRepository.count();
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

    protected LearningCompetency getPersistedLearningCompetency(LearningCompetency learningCompetency) {
        return learningCompetencyRepository.findById(learningCompetency.getId()).orElseThrow();
    }

    protected void assertPersistedLearningCompetencyToMatchAllProperties(LearningCompetency expectedLearningCompetency) {
        assertLearningCompetencyAllPropertiesEquals(expectedLearningCompetency, getPersistedLearningCompetency(expectedLearningCompetency));
    }

    protected void assertPersistedLearningCompetencyToMatchUpdatableProperties(LearningCompetency expectedLearningCompetency) {
        assertLearningCompetencyAllUpdatablePropertiesEquals(
            expectedLearningCompetency,
            getPersistedLearningCompetency(expectedLearningCompetency)
        );
    }
}
