package com.sis.web.rest;

import static com.sis.domain.GradeLevelPayablesAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.GradeLevelPayables;
import com.sis.repository.GradeLevelPayablesRepository;
import com.sis.service.dto.GradeLevelPayablesDTO;
import com.sis.service.mapper.GradeLevelPayablesMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link GradeLevelPayablesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GradeLevelPayablesResourceIT {

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/grade-level-payables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GradeLevelPayablesRepository gradeLevelPayablesRepository;

    @Autowired
    private GradeLevelPayablesMapper gradeLevelPayablesMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGradeLevelPayablesMockMvc;

    private GradeLevelPayables gradeLevelPayables;

    private GradeLevelPayables insertedGradeLevelPayables;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GradeLevelPayables createEntity() {
        return new GradeLevelPayables().active(DEFAULT_ACTIVE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GradeLevelPayables createUpdatedEntity() {
        return new GradeLevelPayables().active(UPDATED_ACTIVE);
    }

    @BeforeEach
    void initTest() {
        gradeLevelPayables = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedGradeLevelPayables != null) {
            gradeLevelPayablesRepository.delete(insertedGradeLevelPayables);
            insertedGradeLevelPayables = null;
        }
    }

    @Test
    @Transactional
    void createGradeLevelPayables() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the GradeLevelPayables
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);
        var returnedGradeLevelPayablesDTO = om.readValue(
            restGradeLevelPayablesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gradeLevelPayablesDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            GradeLevelPayablesDTO.class
        );

        // Validate the GradeLevelPayables in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGradeLevelPayables = gradeLevelPayablesMapper.toEntity(returnedGradeLevelPayablesDTO);
        assertGradeLevelPayablesUpdatableFieldsEquals(
            returnedGradeLevelPayables,
            getPersistedGradeLevelPayables(returnedGradeLevelPayables)
        );

        insertedGradeLevelPayables = returnedGradeLevelPayables;
    }

    @Test
    @Transactional
    void createGradeLevelPayablesWithExistingId() throws Exception {
        // Create the GradeLevelPayables with an existing ID
        gradeLevelPayables.setId(1L);
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGradeLevelPayablesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gradeLevelPayablesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGradeLevelPayableses() throws Exception {
        // Initialize the database
        insertedGradeLevelPayables = gradeLevelPayablesRepository.saveAndFlush(gradeLevelPayables);

        // Get all the gradeLevelPayablesList
        restGradeLevelPayablesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gradeLevelPayables.getId().intValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE)));
    }

    @Test
    @Transactional
    void getGradeLevelPayables() throws Exception {
        // Initialize the database
        insertedGradeLevelPayables = gradeLevelPayablesRepository.saveAndFlush(gradeLevelPayables);

        // Get the gradeLevelPayables
        restGradeLevelPayablesMockMvc
            .perform(get(ENTITY_API_URL_ID, gradeLevelPayables.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gradeLevelPayables.getId().intValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE));
    }

    @Test
    @Transactional
    void getNonExistingGradeLevelPayables() throws Exception {
        // Get the gradeLevelPayables
        restGradeLevelPayablesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGradeLevelPayables() throws Exception {
        // Initialize the database
        insertedGradeLevelPayables = gradeLevelPayablesRepository.saveAndFlush(gradeLevelPayables);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gradeLevelPayables
        GradeLevelPayables updatedGradeLevelPayables = gradeLevelPayablesRepository.findById(gradeLevelPayables.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGradeLevelPayables are not directly saved in db
        em.detach(updatedGradeLevelPayables);
        updatedGradeLevelPayables.active(UPDATED_ACTIVE);
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(updatedGradeLevelPayables);

        restGradeLevelPayablesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gradeLevelPayablesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(gradeLevelPayablesDTO))
            )
            .andExpect(status().isOk());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGradeLevelPayablesToMatchAllProperties(updatedGradeLevelPayables);
    }

    @Test
    @Transactional
    void putNonExistingGradeLevelPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradeLevelPayables.setId(longCount.incrementAndGet());

        // Create the GradeLevelPayables
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGradeLevelPayablesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gradeLevelPayablesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(gradeLevelPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGradeLevelPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradeLevelPayables.setId(longCount.incrementAndGet());

        // Create the GradeLevelPayables
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeLevelPayablesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(gradeLevelPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGradeLevelPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradeLevelPayables.setId(longCount.incrementAndGet());

        // Create the GradeLevelPayables
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeLevelPayablesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gradeLevelPayablesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGradeLevelPayablesWithPatch() throws Exception {
        // Initialize the database
        insertedGradeLevelPayables = gradeLevelPayablesRepository.saveAndFlush(gradeLevelPayables);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gradeLevelPayables using partial update
        GradeLevelPayables partialUpdatedGradeLevelPayables = new GradeLevelPayables();
        partialUpdatedGradeLevelPayables.setId(gradeLevelPayables.getId());

        partialUpdatedGradeLevelPayables.active(UPDATED_ACTIVE);

        restGradeLevelPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGradeLevelPayables.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGradeLevelPayables))
            )
            .andExpect(status().isOk());

        // Validate the GradeLevelPayables in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGradeLevelPayablesUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedGradeLevelPayables, gradeLevelPayables),
            getPersistedGradeLevelPayables(gradeLevelPayables)
        );
    }

    @Test
    @Transactional
    void fullUpdateGradeLevelPayablesWithPatch() throws Exception {
        // Initialize the database
        insertedGradeLevelPayables = gradeLevelPayablesRepository.saveAndFlush(gradeLevelPayables);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gradeLevelPayables using partial update
        GradeLevelPayables partialUpdatedGradeLevelPayables = new GradeLevelPayables();
        partialUpdatedGradeLevelPayables.setId(gradeLevelPayables.getId());

        partialUpdatedGradeLevelPayables.active(UPDATED_ACTIVE);

        restGradeLevelPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGradeLevelPayables.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGradeLevelPayables))
            )
            .andExpect(status().isOk());

        // Validate the GradeLevelPayables in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGradeLevelPayablesUpdatableFieldsEquals(
            partialUpdatedGradeLevelPayables,
            getPersistedGradeLevelPayables(partialUpdatedGradeLevelPayables)
        );
    }

    @Test
    @Transactional
    void patchNonExistingGradeLevelPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradeLevelPayables.setId(longCount.incrementAndGet());

        // Create the GradeLevelPayables
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGradeLevelPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gradeLevelPayablesDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(gradeLevelPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGradeLevelPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradeLevelPayables.setId(longCount.incrementAndGet());

        // Create the GradeLevelPayables
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeLevelPayablesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(gradeLevelPayablesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGradeLevelPayables() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradeLevelPayables.setId(longCount.incrementAndGet());

        // Create the GradeLevelPayables
        GradeLevelPayablesDTO gradeLevelPayablesDTO = gradeLevelPayablesMapper.toDto(gradeLevelPayables);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeLevelPayablesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(gradeLevelPayablesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GradeLevelPayables in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGradeLevelPayables() throws Exception {
        // Initialize the database
        insertedGradeLevelPayables = gradeLevelPayablesRepository.saveAndFlush(gradeLevelPayables);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the gradeLevelPayables
        restGradeLevelPayablesMockMvc
            .perform(delete(ENTITY_API_URL_ID, gradeLevelPayables.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return gradeLevelPayablesRepository.count();
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

    protected GradeLevelPayables getPersistedGradeLevelPayables(GradeLevelPayables gradeLevelPayables) {
        return gradeLevelPayablesRepository.findById(gradeLevelPayables.getId()).orElseThrow();
    }

    protected void assertPersistedGradeLevelPayablesToMatchAllProperties(GradeLevelPayables expectedGradeLevelPayables) {
        assertGradeLevelPayablesAllPropertiesEquals(expectedGradeLevelPayables, getPersistedGradeLevelPayables(expectedGradeLevelPayables));
    }

    protected void assertPersistedGradeLevelPayablesToMatchUpdatableProperties(GradeLevelPayables expectedGradeLevelPayables) {
        assertGradeLevelPayablesAllUpdatablePropertiesEquals(
            expectedGradeLevelPayables,
            getPersistedGradeLevelPayables(expectedGradeLevelPayables)
        );
    }
}
