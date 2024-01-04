package com.sis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sis.IntegrationTest;
import com.sis.domain.Strategies;
import com.sis.repository.StrategiesRepository;
import com.sis.service.dto.StrategiesDTO;
import com.sis.service.mapper.StrategiesMapper;
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
 * Integration tests for the {@link StrategiesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StrategiesResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/strategies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StrategiesRepository strategiesRepository;

    @Autowired
    private StrategiesMapper strategiesMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStrategiesMockMvc;

    private Strategies strategies;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Strategies createEntity(EntityManager em) {
        Strategies strategies = new Strategies().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return strategies;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Strategies createUpdatedEntity(EntityManager em) {
        Strategies strategies = new Strategies().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return strategies;
    }

    @BeforeEach
    public void initTest() {
        strategies = createEntity(em);
    }

    @Test
    @Transactional
    void createStrategies() throws Exception {
        int databaseSizeBeforeCreate = strategiesRepository.findAll().size();
        // Create the Strategies
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);
        restStrategiesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(strategiesDTO)))
            .andExpect(status().isCreated());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeCreate + 1);
        Strategies testStrategies = strategiesList.get(strategiesList.size() - 1);
        assertThat(testStrategies.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStrategies.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createStrategiesWithExistingId() throws Exception {
        // Create the Strategies with an existing ID
        strategies.setId(1L);
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);

        int databaseSizeBeforeCreate = strategiesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStrategiesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(strategiesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStrategies() throws Exception {
        // Initialize the database
        strategiesRepository.saveAndFlush(strategies);

        // Get all the strategiesList
        restStrategiesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(strategies.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getStrategies() throws Exception {
        // Initialize the database
        strategiesRepository.saveAndFlush(strategies);

        // Get the strategies
        restStrategiesMockMvc
            .perform(get(ENTITY_API_URL_ID, strategies.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(strategies.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingStrategies() throws Exception {
        // Get the strategies
        restStrategiesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStrategies() throws Exception {
        // Initialize the database
        strategiesRepository.saveAndFlush(strategies);

        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();

        // Update the strategies
        Strategies updatedStrategies = strategiesRepository.findById(strategies.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStrategies are not directly saved in db
        em.detach(updatedStrategies);
        updatedStrategies.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(updatedStrategies);

        restStrategiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, strategiesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(strategiesDTO))
            )
            .andExpect(status().isOk());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
        Strategies testStrategies = strategiesList.get(strategiesList.size() - 1);
        assertThat(testStrategies.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStrategies.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingStrategies() throws Exception {
        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();
        strategies.setId(longCount.incrementAndGet());

        // Create the Strategies
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStrategiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, strategiesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(strategiesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStrategies() throws Exception {
        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();
        strategies.setId(longCount.incrementAndGet());

        // Create the Strategies
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStrategiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(strategiesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStrategies() throws Exception {
        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();
        strategies.setId(longCount.incrementAndGet());

        // Create the Strategies
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStrategiesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(strategiesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStrategiesWithPatch() throws Exception {
        // Initialize the database
        strategiesRepository.saveAndFlush(strategies);

        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();

        // Update the strategies using partial update
        Strategies partialUpdatedStrategies = new Strategies();
        partialUpdatedStrategies.setId(strategies.getId());

        partialUpdatedStrategies.description(UPDATED_DESCRIPTION);

        restStrategiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStrategies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStrategies))
            )
            .andExpect(status().isOk());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
        Strategies testStrategies = strategiesList.get(strategiesList.size() - 1);
        assertThat(testStrategies.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStrategies.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateStrategiesWithPatch() throws Exception {
        // Initialize the database
        strategiesRepository.saveAndFlush(strategies);

        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();

        // Update the strategies using partial update
        Strategies partialUpdatedStrategies = new Strategies();
        partialUpdatedStrategies.setId(strategies.getId());

        partialUpdatedStrategies.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restStrategiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStrategies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStrategies))
            )
            .andExpect(status().isOk());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
        Strategies testStrategies = strategiesList.get(strategiesList.size() - 1);
        assertThat(testStrategies.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStrategies.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingStrategies() throws Exception {
        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();
        strategies.setId(longCount.incrementAndGet());

        // Create the Strategies
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStrategiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, strategiesDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(strategiesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStrategies() throws Exception {
        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();
        strategies.setId(longCount.incrementAndGet());

        // Create the Strategies
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStrategiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(strategiesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStrategies() throws Exception {
        int databaseSizeBeforeUpdate = strategiesRepository.findAll().size();
        strategies.setId(longCount.incrementAndGet());

        // Create the Strategies
        StrategiesDTO strategiesDTO = strategiesMapper.toDto(strategies);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStrategiesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(strategiesDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Strategies in the database
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStrategies() throws Exception {
        // Initialize the database
        strategiesRepository.saveAndFlush(strategies);

        int databaseSizeBeforeDelete = strategiesRepository.findAll().size();

        // Delete the strategies
        restStrategiesMockMvc
            .perform(delete(ENTITY_API_URL_ID, strategies.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Strategies> strategiesList = strategiesRepository.findAll();
        assertThat(strategiesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
