package com.sis.web.rest;

import static com.sis.domain.AppConfigAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.AppConfig;
import com.sis.repository.AppConfigRepository;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.mapper.AppConfigMapper;
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
 * Integration tests for the {@link AppConfigResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AppConfigResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_JSON = "AAAAAAAAAA";
    private static final String UPDATED_JSON = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRIORITY = 1;
    private static final Integer UPDATED_PRIORITY = 2;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/app-configs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AppConfigRepository appConfigRepository;

    @Autowired
    private AppConfigMapper appConfigMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppConfigMockMvc;

    private AppConfig appConfig;

    private AppConfig insertedAppConfig;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppConfig createEntity() {
        return new AppConfig()
            .code(DEFAULT_CODE)
            .value(DEFAULT_VALUE)
            .description(DEFAULT_DESCRIPTION)
            .json(DEFAULT_JSON)
            .priority(DEFAULT_PRIORITY)
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
    public static AppConfig createUpdatedEntity() {
        return new AppConfig()
            .code(UPDATED_CODE)
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .json(UPDATED_JSON)
            .priority(UPDATED_PRIORITY)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        appConfig = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAppConfig != null) {
            appConfigRepository.delete(insertedAppConfig);
            insertedAppConfig = null;
        }
    }

    @Test
    @Transactional
    void createAppConfig() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AppConfig
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);
        var returnedAppConfigDTO = om.readValue(
            restAppConfigMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appConfigDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AppConfigDTO.class
        );

        // Validate the AppConfig in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAppConfig = appConfigMapper.toEntity(returnedAppConfigDTO);
        assertAppConfigUpdatableFieldsEquals(returnedAppConfig, getPersistedAppConfig(returnedAppConfig));

        insertedAppConfig = returnedAppConfig;
    }

    @Test
    @Transactional
    void createAppConfigWithExistingId() throws Exception {
        // Create the AppConfig with an existing ID
        appConfig.setId(1L);
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppConfigMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appConfigDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAppConfigs() throws Exception {
        // Initialize the database
        insertedAppConfig = appConfigRepository.saveAndFlush(appConfig);

        // Get all the appConfigList
        restAppConfigMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appConfig.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].json").value(hasItem(DEFAULT_JSON)))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getAppConfig() throws Exception {
        // Initialize the database
        insertedAppConfig = appConfigRepository.saveAndFlush(appConfig);

        // Get the appConfig
        restAppConfigMockMvc
            .perform(get(ENTITY_API_URL_ID, appConfig.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appConfig.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.json").value(DEFAULT_JSON))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAppConfig() throws Exception {
        // Get the appConfig
        restAppConfigMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAppConfig() throws Exception {
        // Initialize the database
        insertedAppConfig = appConfigRepository.saveAndFlush(appConfig);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the appConfig
        AppConfig updatedAppConfig = appConfigRepository.findById(appConfig.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAppConfig are not directly saved in db
        em.detach(updatedAppConfig);
        updatedAppConfig
            .code(UPDATED_CODE)
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .json(UPDATED_JSON)
            .priority(UPDATED_PRIORITY)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(updatedAppConfig);

        restAppConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appConfigDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(appConfigDTO))
            )
            .andExpect(status().isOk());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAppConfigToMatchAllProperties(updatedAppConfig);
    }

    @Test
    @Transactional
    void putNonExistingAppConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appConfig.setId(longCount.incrementAndGet());

        // Create the AppConfig
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appConfigDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(appConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appConfig.setId(longCount.incrementAndGet());

        // Create the AppConfig
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(appConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appConfig.setId(longCount.incrementAndGet());

        // Create the AppConfig
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppConfigMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appConfigDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppConfigWithPatch() throws Exception {
        // Initialize the database
        insertedAppConfig = appConfigRepository.saveAndFlush(appConfig);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the appConfig using partial update
        AppConfig partialUpdatedAppConfig = new AppConfig();
        partialUpdatedAppConfig.setId(appConfig.getId());

        partialUpdatedAppConfig
            .priority(UPDATED_PRIORITY)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAppConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppConfig.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAppConfig))
            )
            .andExpect(status().isOk());

        // Validate the AppConfig in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAppConfigUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAppConfig, appConfig),
            getPersistedAppConfig(appConfig)
        );
    }

    @Test
    @Transactional
    void fullUpdateAppConfigWithPatch() throws Exception {
        // Initialize the database
        insertedAppConfig = appConfigRepository.saveAndFlush(appConfig);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the appConfig using partial update
        AppConfig partialUpdatedAppConfig = new AppConfig();
        partialUpdatedAppConfig.setId(appConfig.getId());

        partialUpdatedAppConfig
            .code(UPDATED_CODE)
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .json(UPDATED_JSON)
            .priority(UPDATED_PRIORITY)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAppConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppConfig.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAppConfig))
            )
            .andExpect(status().isOk());

        // Validate the AppConfig in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAppConfigUpdatableFieldsEquals(partialUpdatedAppConfig, getPersistedAppConfig(partialUpdatedAppConfig));
    }

    @Test
    @Transactional
    void patchNonExistingAppConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appConfig.setId(longCount.incrementAndGet());

        // Create the AppConfig
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appConfigDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(appConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appConfig.setId(longCount.incrementAndGet());

        // Create the AppConfig
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(appConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appConfig.setId(longCount.incrementAndGet());

        // Create the AppConfig
        AppConfigDTO appConfigDTO = appConfigMapper.toDto(appConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppConfigMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(appConfigDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppConfig() throws Exception {
        // Initialize the database
        insertedAppConfig = appConfigRepository.saveAndFlush(appConfig);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the appConfig
        restAppConfigMockMvc
            .perform(delete(ENTITY_API_URL_ID, appConfig.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return appConfigRepository.count();
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

    protected AppConfig getPersistedAppConfig(AppConfig appConfig) {
        return appConfigRepository.findById(appConfig.getId()).orElseThrow();
    }

    protected void assertPersistedAppConfigToMatchAllProperties(AppConfig expectedAppConfig) {
        assertAppConfigAllPropertiesEquals(expectedAppConfig, getPersistedAppConfig(expectedAppConfig));
    }

    protected void assertPersistedAppConfigToMatchUpdatableProperties(AppConfig expectedAppConfig) {
        assertAppConfigAllUpdatablePropertiesEquals(expectedAppConfig, getPersistedAppConfig(expectedAppConfig));
    }
}
