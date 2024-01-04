package com.sis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sis.IntegrationTest;
import com.sis.domain.LearningCompetency;
import com.sis.repository.LearningCompetencyRepository;
import com.sis.service.dto.LearningCompetencyDTO;
import com.sis.service.mapper.LearningCompetencyMapper;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
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

    private static final String ENTITY_API_URL = "/api/learning-competencies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LearningCompetencyRepository learningCompetencyRepository;

    @Autowired
    private LearningCompetencyMapper learningCompetencyMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLearningCompetencyMockMvc;

    private LearningCompetency learningCompetency;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LearningCompetency createEntity(EntityManager em) {
        LearningCompetency learningCompetency = new LearningCompetency()
            .seqNo(DEFAULT_SEQ_NO)
            .competencyCode(DEFAULT_COMPETENCY_CODE)
            .description(DEFAULT_DESCRIPTION);
        return learningCompetency;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LearningCompetency createUpdatedEntity(EntityManager em) {
        LearningCompetency learningCompetency = new LearningCompetency()
            .seqNo(UPDATED_SEQ_NO)
            .competencyCode(UPDATED_COMPETENCY_CODE)
            .description(UPDATED_DESCRIPTION);
        return learningCompetency;
    }

    @BeforeEach
    public void initTest() {
        learningCompetency = createEntity(em);
    }

    @Test
    @Transactional
    void createLearningCompetency() throws Exception {
        int databaseSizeBeforeCreate = learningCompetencyRepository.findAll().size();
        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);
        restLearningCompetencyMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isCreated());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeCreate + 1);
        LearningCompetency testLearningCompetency = learningCompetencyList.get(learningCompetencyList.size() - 1);
        assertThat(testLearningCompetency.getSeqNo()).isEqualTo(DEFAULT_SEQ_NO);
        assertThat(testLearningCompetency.getCompetencyCode()).isEqualTo(DEFAULT_COMPETENCY_CODE);
        assertThat(testLearningCompetency.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createLearningCompetencyWithExistingId() throws Exception {
        // Create the LearningCompetency with an existing ID
        learningCompetency.setId(1L);
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        int databaseSizeBeforeCreate = learningCompetencyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLearningCompetencyMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLearningCompetencies() throws Exception {
        // Initialize the database
        learningCompetencyRepository.saveAndFlush(learningCompetency);

        // Get all the learningCompetencyList
        restLearningCompetencyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(learningCompetency.getId().intValue())))
            .andExpect(jsonPath("$.[*].seqNo").value(hasItem(DEFAULT_SEQ_NO)))
            .andExpect(jsonPath("$.[*].competencyCode").value(hasItem(DEFAULT_COMPETENCY_CODE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getLearningCompetency() throws Exception {
        // Initialize the database
        learningCompetencyRepository.saveAndFlush(learningCompetency);

        // Get the learningCompetency
        restLearningCompetencyMockMvc
            .perform(get(ENTITY_API_URL_ID, learningCompetency.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(learningCompetency.getId().intValue()))
            .andExpect(jsonPath("$.seqNo").value(DEFAULT_SEQ_NO))
            .andExpect(jsonPath("$.competencyCode").value(DEFAULT_COMPETENCY_CODE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
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
        learningCompetencyRepository.saveAndFlush(learningCompetency);

        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();

        // Update the learningCompetency
        LearningCompetency updatedLearningCompetency = learningCompetencyRepository.findById(learningCompetency.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLearningCompetency are not directly saved in db
        em.detach(updatedLearningCompetency);
        updatedLearningCompetency.seqNo(UPDATED_SEQ_NO).competencyCode(UPDATED_COMPETENCY_CODE).description(UPDATED_DESCRIPTION);
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(updatedLearningCompetency);

        restLearningCompetencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, learningCompetencyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isOk());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
        LearningCompetency testLearningCompetency = learningCompetencyList.get(learningCompetencyList.size() - 1);
        assertThat(testLearningCompetency.getSeqNo()).isEqualTo(UPDATED_SEQ_NO);
        assertThat(testLearningCompetency.getCompetencyCode()).isEqualTo(UPDATED_COMPETENCY_CODE);
        assertThat(testLearningCompetency.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingLearningCompetency() throws Exception {
        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, learningCompetencyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLearningCompetency() throws Exception {
        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLearningCompetency() throws Exception {
        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLearningCompetencyWithPatch() throws Exception {
        // Initialize the database
        learningCompetencyRepository.saveAndFlush(learningCompetency);

        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();

        // Update the learningCompetency using partial update
        LearningCompetency partialUpdatedLearningCompetency = new LearningCompetency();
        partialUpdatedLearningCompetency.setId(learningCompetency.getId());

        partialUpdatedLearningCompetency.seqNo(UPDATED_SEQ_NO);

        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearningCompetency.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLearningCompetency))
            )
            .andExpect(status().isOk());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
        LearningCompetency testLearningCompetency = learningCompetencyList.get(learningCompetencyList.size() - 1);
        assertThat(testLearningCompetency.getSeqNo()).isEqualTo(UPDATED_SEQ_NO);
        assertThat(testLearningCompetency.getCompetencyCode()).isEqualTo(DEFAULT_COMPETENCY_CODE);
        assertThat(testLearningCompetency.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateLearningCompetencyWithPatch() throws Exception {
        // Initialize the database
        learningCompetencyRepository.saveAndFlush(learningCompetency);

        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();

        // Update the learningCompetency using partial update
        LearningCompetency partialUpdatedLearningCompetency = new LearningCompetency();
        partialUpdatedLearningCompetency.setId(learningCompetency.getId());

        partialUpdatedLearningCompetency.seqNo(UPDATED_SEQ_NO).competencyCode(UPDATED_COMPETENCY_CODE).description(UPDATED_DESCRIPTION);

        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearningCompetency.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLearningCompetency))
            )
            .andExpect(status().isOk());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
        LearningCompetency testLearningCompetency = learningCompetencyList.get(learningCompetencyList.size() - 1);
        assertThat(testLearningCompetency.getSeqNo()).isEqualTo(UPDATED_SEQ_NO);
        assertThat(testLearningCompetency.getCompetencyCode()).isEqualTo(UPDATED_COMPETENCY_CODE);
        assertThat(testLearningCompetency.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingLearningCompetency() throws Exception {
        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, learningCompetencyDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLearningCompetency() throws Exception {
        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLearningCompetency() throws Exception {
        int databaseSizeBeforeUpdate = learningCompetencyRepository.findAll().size();
        learningCompetency.setId(longCount.incrementAndGet());

        // Create the LearningCompetency
        LearningCompetencyDTO learningCompetencyDTO = learningCompetencyMapper.toDto(learningCompetency);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningCompetencyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(learningCompetencyDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LearningCompetency in the database
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLearningCompetency() throws Exception {
        // Initialize the database
        learningCompetencyRepository.saveAndFlush(learningCompetency);

        int databaseSizeBeforeDelete = learningCompetencyRepository.findAll().size();

        // Delete the learningCompetency
        restLearningCompetencyMockMvc
            .perform(delete(ENTITY_API_URL_ID, learningCompetency.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LearningCompetency> learningCompetencyList = learningCompetencyRepository.findAll();
        assertThat(learningCompetencyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
