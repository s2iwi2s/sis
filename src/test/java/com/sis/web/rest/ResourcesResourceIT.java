package com.sis.web.rest;

import static com.sis.domain.ResourcesAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.Resources;
import com.sis.repository.ResourcesRepository;
import com.sis.service.dto.ResourcesDTO;
import com.sis.service.mapper.ResourcesMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
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
 * Integration tests for the {@link ResourcesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ResourcesResourceIT {

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DOCUMENT = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DOCUMENT = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DOCUMENT_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DOCUMENT_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/resources";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ResourcesRepository resourcesRepository;

    @Autowired
    private ResourcesMapper resourcesMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResourcesMockMvc;

    private Resources resources;

    private Resources insertedResources;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Resources createEntity() {
        return new Resources()
            .fileName(DEFAULT_FILE_NAME)
            .document(DEFAULT_DOCUMENT)
            .documentContentType(DEFAULT_DOCUMENT_CONTENT_TYPE)
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
    public static Resources createUpdatedEntity() {
        return new Resources()
            .fileName(UPDATED_FILE_NAME)
            .document(UPDATED_DOCUMENT)
            .documentContentType(UPDATED_DOCUMENT_CONTENT_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        resources = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedResources != null) {
            resourcesRepository.delete(insertedResources);
            insertedResources = null;
        }
    }

    @Test
    @Transactional
    void createResources() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Resources
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);
        var returnedResourcesDTO = om.readValue(
            restResourcesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(resourcesDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ResourcesDTO.class
        );

        // Validate the Resources in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedResources = resourcesMapper.toEntity(returnedResourcesDTO);
        assertResourcesUpdatableFieldsEquals(returnedResources, getPersistedResources(returnedResources));

        insertedResources = returnedResources;
    }

    @Test
    @Transactional
    void createResourcesWithExistingId() throws Exception {
        // Create the Resources with an existing ID
        resources.setId(1L);
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restResourcesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(resourcesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllResourceses() throws Exception {
        // Initialize the database
        insertedResources = resourcesRepository.saveAndFlush(resources);

        // Get all the resourcesList
        restResourcesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resources.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].documentContentType").value(hasItem(DEFAULT_DOCUMENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].document").value(hasItem(Base64.getEncoder().encodeToString(DEFAULT_DOCUMENT))))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getResources() throws Exception {
        // Initialize the database
        insertedResources = resourcesRepository.saveAndFlush(resources);

        // Get the resources
        restResourcesMockMvc
            .perform(get(ENTITY_API_URL_ID, resources.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resources.getId().intValue()))
            .andExpect(jsonPath("$.fileName").value(DEFAULT_FILE_NAME))
            .andExpect(jsonPath("$.documentContentType").value(DEFAULT_DOCUMENT_CONTENT_TYPE))
            .andExpect(jsonPath("$.document").value(Base64.getEncoder().encodeToString(DEFAULT_DOCUMENT)))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingResources() throws Exception {
        // Get the resources
        restResourcesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingResources() throws Exception {
        // Initialize the database
        insertedResources = resourcesRepository.saveAndFlush(resources);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the resources
        Resources updatedResources = resourcesRepository.findById(resources.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedResources are not directly saved in db
        em.detach(updatedResources);
        updatedResources
            .fileName(UPDATED_FILE_NAME)
            .document(UPDATED_DOCUMENT)
            .documentContentType(UPDATED_DOCUMENT_CONTENT_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(updatedResources);

        restResourcesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resourcesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(resourcesDTO))
            )
            .andExpect(status().isOk());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedResourcesToMatchAllProperties(updatedResources);
    }

    @Test
    @Transactional
    void putNonExistingResources() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        resources.setId(longCount.incrementAndGet());

        // Create the Resources
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourcesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resourcesDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(resourcesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchResources() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        resources.setId(longCount.incrementAndGet());

        // Create the Resources
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(resourcesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamResources() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        resources.setId(longCount.incrementAndGet());

        // Create the Resources
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(resourcesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateResourcesWithPatch() throws Exception {
        // Initialize the database
        insertedResources = resourcesRepository.saveAndFlush(resources);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the resources using partial update
        Resources partialUpdatedResources = new Resources();
        partialUpdatedResources.setId(resources.getId());

        partialUpdatedResources.lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restResourcesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResources.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedResources))
            )
            .andExpect(status().isOk());

        // Validate the Resources in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertResourcesUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedResources, resources),
            getPersistedResources(resources)
        );
    }

    @Test
    @Transactional
    void fullUpdateResourcesWithPatch() throws Exception {
        // Initialize the database
        insertedResources = resourcesRepository.saveAndFlush(resources);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the resources using partial update
        Resources partialUpdatedResources = new Resources();
        partialUpdatedResources.setId(resources.getId());

        partialUpdatedResources
            .fileName(UPDATED_FILE_NAME)
            .document(UPDATED_DOCUMENT)
            .documentContentType(UPDATED_DOCUMENT_CONTENT_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restResourcesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResources.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedResources))
            )
            .andExpect(status().isOk());

        // Validate the Resources in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertResourcesUpdatableFieldsEquals(partialUpdatedResources, getPersistedResources(partialUpdatedResources));
    }

    @Test
    @Transactional
    void patchNonExistingResources() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        resources.setId(longCount.incrementAndGet());

        // Create the Resources
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourcesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, resourcesDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(resourcesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchResources() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        resources.setId(longCount.incrementAndGet());

        // Create the Resources
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(resourcesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamResources() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        resources.setId(longCount.incrementAndGet());

        // Create the Resources
        ResourcesDTO resourcesDTO = resourcesMapper.toDto(resources);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(resourcesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resources in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteResources() throws Exception {
        // Initialize the database
        insertedResources = resourcesRepository.saveAndFlush(resources);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the resources
        restResourcesMockMvc
            .perform(delete(ENTITY_API_URL_ID, resources.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return resourcesRepository.count();
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

    protected Resources getPersistedResources(Resources resources) {
        return resourcesRepository.findById(resources.getId()).orElseThrow();
    }

    protected void assertPersistedResourcesToMatchAllProperties(Resources expectedResources) {
        assertResourcesAllPropertiesEquals(expectedResources, getPersistedResources(expectedResources));
    }

    protected void assertPersistedResourcesToMatchUpdatableProperties(Resources expectedResources) {
        assertResourcesAllUpdatablePropertiesEquals(expectedResources, getPersistedResources(expectedResources));
    }
}
