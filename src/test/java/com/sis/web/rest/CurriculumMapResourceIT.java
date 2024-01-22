package com.sis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sis.IntegrationTest;
import com.sis.domain.CurriculumMap;
import com.sis.repository.CurriculumMapRepository;
import com.sis.service.dto.CurriculumMapDTO;
import com.sis.service.mapper.CurriculumMapMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link CurriculumMapResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CurriculumMapResourceIT {

    private static final Integer DEFAULT_QUARTER_NO = 1;
    private static final Integer UPDATED_QUARTER_NO = 2;

    private static final Integer DEFAULT_WEEK_NO = 1;
    private static final Integer UPDATED_WEEK_NO = 2;

    private static final String DEFAULT_TOPIC = "AAAAAAAAAA";
    private static final String UPDATED_TOPIC = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT_STANDARDS = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT_STANDARDS = "BBBBBBBBBB";

    private static final String DEFAULT_PERFORMANCE_STANDARDS = "AAAAAAAAAA";
    private static final String UPDATED_PERFORMANCE_STANDARDS = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/curriculum-maps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private CurriculumMapRepository curriculumMapRepository;

    @Autowired
    private CurriculumMapMapper curriculumMapMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCurriculumMapMockMvc;

    private CurriculumMap curriculumMap;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CurriculumMap createEntity(EntityManager em) {
        CurriculumMap curriculumMap = new CurriculumMap()
            .quarterNo(DEFAULT_QUARTER_NO)
            .weekNo(DEFAULT_WEEK_NO)
            .topic(DEFAULT_TOPIC)
            .contentStandards(DEFAULT_CONTENT_STANDARDS)
            .performanceStandards(DEFAULT_PERFORMANCE_STANDARDS)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return curriculumMap;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CurriculumMap createUpdatedEntity(EntityManager em) {
        CurriculumMap curriculumMap = new CurriculumMap()
            .quarterNo(UPDATED_QUARTER_NO)
            .weekNo(UPDATED_WEEK_NO)
            .topic(UPDATED_TOPIC)
            .contentStandards(UPDATED_CONTENT_STANDARDS)
            .performanceStandards(UPDATED_PERFORMANCE_STANDARDS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        return curriculumMap;
    }

    @BeforeEach
    public void initTest() {
        curriculumMap = createEntity(em);
    }

    @Test
    @Transactional
    void createCurriculumMap() throws Exception {
        int databaseSizeBeforeCreate = curriculumMapRepository.findAll().size();
        // Create the CurriculumMap
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);
        restCurriculumMapMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isCreated());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeCreate + 1);
        CurriculumMap testCurriculumMap = curriculumMapList.get(curriculumMapList.size() - 1);
        assertThat(testCurriculumMap.getQuarterNo()).isEqualTo(DEFAULT_QUARTER_NO);
        assertThat(testCurriculumMap.getWeekNo()).isEqualTo(DEFAULT_WEEK_NO);
        assertThat(testCurriculumMap.getTopic()).isEqualTo(DEFAULT_TOPIC);
        assertThat(testCurriculumMap.getContentStandards()).isEqualTo(DEFAULT_CONTENT_STANDARDS);
        assertThat(testCurriculumMap.getPerformanceStandards()).isEqualTo(DEFAULT_PERFORMANCE_STANDARDS);
        assertThat(testCurriculumMap.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testCurriculumMap.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testCurriculumMap.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testCurriculumMap.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void createCurriculumMapWithExistingId() throws Exception {
        // Create the CurriculumMap with an existing ID
        curriculumMap.setId(1L);
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);

        int databaseSizeBeforeCreate = curriculumMapRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCurriculumMapMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCurriculumMaps() throws Exception {
        // Initialize the database
        curriculumMapRepository.saveAndFlush(curriculumMap);

        // Get all the curriculumMapList
        restCurriculumMapMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(curriculumMap.getId().intValue())))
            .andExpect(jsonPath("$.[*].quarterNo").value(hasItem(DEFAULT_QUARTER_NO)))
            .andExpect(jsonPath("$.[*].weekNo").value(hasItem(DEFAULT_WEEK_NO)))
            .andExpect(jsonPath("$.[*].topic").value(hasItem(DEFAULT_TOPIC)))
            .andExpect(jsonPath("$.[*].contentStandards").value(hasItem(DEFAULT_CONTENT_STANDARDS)))
            .andExpect(jsonPath("$.[*].performanceStandards").value(hasItem(DEFAULT_PERFORMANCE_STANDARDS)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getCurriculumMap() throws Exception {
        // Initialize the database
        curriculumMapRepository.saveAndFlush(curriculumMap);

        // Get the curriculumMap
        restCurriculumMapMockMvc
            .perform(get(ENTITY_API_URL_ID, curriculumMap.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(curriculumMap.getId().intValue()))
            .andExpect(jsonPath("$.quarterNo").value(DEFAULT_QUARTER_NO))
            .andExpect(jsonPath("$.weekNo").value(DEFAULT_WEEK_NO))
            .andExpect(jsonPath("$.topic").value(DEFAULT_TOPIC))
            .andExpect(jsonPath("$.contentStandards").value(DEFAULT_CONTENT_STANDARDS))
            .andExpect(jsonPath("$.performanceStandards").value(DEFAULT_PERFORMANCE_STANDARDS))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCurriculumMap() throws Exception {
        // Get the curriculumMap
        restCurriculumMapMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCurriculumMap() throws Exception {
        // Initialize the database
        curriculumMapRepository.saveAndFlush(curriculumMap);

        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();

        // Update the curriculumMap
        CurriculumMap updatedCurriculumMap = curriculumMapRepository.findById(curriculumMap.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCurriculumMap are not directly saved in db
        em.detach(updatedCurriculumMap);
        updatedCurriculumMap
            .quarterNo(UPDATED_QUARTER_NO)
            .weekNo(UPDATED_WEEK_NO)
            .topic(UPDATED_TOPIC)
            .contentStandards(UPDATED_CONTENT_STANDARDS)
            .performanceStandards(UPDATED_PERFORMANCE_STANDARDS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(updatedCurriculumMap);

        restCurriculumMapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, curriculumMapDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isOk());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
        CurriculumMap testCurriculumMap = curriculumMapList.get(curriculumMapList.size() - 1);
        assertThat(testCurriculumMap.getQuarterNo()).isEqualTo(UPDATED_QUARTER_NO);
        assertThat(testCurriculumMap.getWeekNo()).isEqualTo(UPDATED_WEEK_NO);
        assertThat(testCurriculumMap.getTopic()).isEqualTo(UPDATED_TOPIC);
        assertThat(testCurriculumMap.getContentStandards()).isEqualTo(UPDATED_CONTENT_STANDARDS);
        assertThat(testCurriculumMap.getPerformanceStandards()).isEqualTo(UPDATED_PERFORMANCE_STANDARDS);
        assertThat(testCurriculumMap.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testCurriculumMap.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testCurriculumMap.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testCurriculumMap.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingCurriculumMap() throws Exception {
        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();
        curriculumMap.setId(longCount.incrementAndGet());

        // Create the CurriculumMap
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCurriculumMapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, curriculumMapDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCurriculumMap() throws Exception {
        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();
        curriculumMap.setId(longCount.incrementAndGet());

        // Create the CurriculumMap
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurriculumMapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCurriculumMap() throws Exception {
        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();
        curriculumMap.setId(longCount.incrementAndGet());

        // Create the CurriculumMap
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurriculumMapMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCurriculumMapWithPatch() throws Exception {
        // Initialize the database
        curriculumMapRepository.saveAndFlush(curriculumMap);

        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();

        // Update the curriculumMap using partial update
        CurriculumMap partialUpdatedCurriculumMap = new CurriculumMap();
        partialUpdatedCurriculumMap.setId(curriculumMap.getId());

        partialUpdatedCurriculumMap
            .contentStandards(UPDATED_CONTENT_STANDARDS)
            .performanceStandards(UPDATED_PERFORMANCE_STANDARDS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCurriculumMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCurriculumMap.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCurriculumMap))
            )
            .andExpect(status().isOk());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
        CurriculumMap testCurriculumMap = curriculumMapList.get(curriculumMapList.size() - 1);
        assertThat(testCurriculumMap.getQuarterNo()).isEqualTo(DEFAULT_QUARTER_NO);
        assertThat(testCurriculumMap.getWeekNo()).isEqualTo(DEFAULT_WEEK_NO);
        assertThat(testCurriculumMap.getTopic()).isEqualTo(DEFAULT_TOPIC);
        assertThat(testCurriculumMap.getContentStandards()).isEqualTo(UPDATED_CONTENT_STANDARDS);
        assertThat(testCurriculumMap.getPerformanceStandards()).isEqualTo(UPDATED_PERFORMANCE_STANDARDS);
        assertThat(testCurriculumMap.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testCurriculumMap.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testCurriculumMap.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testCurriculumMap.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateCurriculumMapWithPatch() throws Exception {
        // Initialize the database
        curriculumMapRepository.saveAndFlush(curriculumMap);

        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();

        // Update the curriculumMap using partial update
        CurriculumMap partialUpdatedCurriculumMap = new CurriculumMap();
        partialUpdatedCurriculumMap.setId(curriculumMap.getId());

        partialUpdatedCurriculumMap
            .quarterNo(UPDATED_QUARTER_NO)
            .weekNo(UPDATED_WEEK_NO)
            .topic(UPDATED_TOPIC)
            .contentStandards(UPDATED_CONTENT_STANDARDS)
            .performanceStandards(UPDATED_PERFORMANCE_STANDARDS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCurriculumMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCurriculumMap.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCurriculumMap))
            )
            .andExpect(status().isOk());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
        CurriculumMap testCurriculumMap = curriculumMapList.get(curriculumMapList.size() - 1);
        assertThat(testCurriculumMap.getQuarterNo()).isEqualTo(UPDATED_QUARTER_NO);
        assertThat(testCurriculumMap.getWeekNo()).isEqualTo(UPDATED_WEEK_NO);
        assertThat(testCurriculumMap.getTopic()).isEqualTo(UPDATED_TOPIC);
        assertThat(testCurriculumMap.getContentStandards()).isEqualTo(UPDATED_CONTENT_STANDARDS);
        assertThat(testCurriculumMap.getPerformanceStandards()).isEqualTo(UPDATED_PERFORMANCE_STANDARDS);
        assertThat(testCurriculumMap.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testCurriculumMap.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testCurriculumMap.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testCurriculumMap.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingCurriculumMap() throws Exception {
        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();
        curriculumMap.setId(longCount.incrementAndGet());

        // Create the CurriculumMap
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCurriculumMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, curriculumMapDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCurriculumMap() throws Exception {
        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();
        curriculumMap.setId(longCount.incrementAndGet());

        // Create the CurriculumMap
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurriculumMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCurriculumMap() throws Exception {
        int databaseSizeBeforeUpdate = curriculumMapRepository.findAll().size();
        curriculumMap.setId(longCount.incrementAndGet());

        // Create the CurriculumMap
        CurriculumMapDTO curriculumMapDTO = curriculumMapMapper.toDto(curriculumMap);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCurriculumMapMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(curriculumMapDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CurriculumMap in the database
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCurriculumMap() throws Exception {
        // Initialize the database
        curriculumMapRepository.saveAndFlush(curriculumMap);

        int databaseSizeBeforeDelete = curriculumMapRepository.findAll().size();

        // Delete the curriculumMap
        restCurriculumMapMockMvc
            .perform(delete(ENTITY_API_URL_ID, curriculumMap.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CurriculumMap> curriculumMapList = curriculumMapRepository.findAll();
        assertThat(curriculumMapList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
