package com.sis.web.rest;

import static com.sis.domain.DepartmentsAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.Departments;
import com.sis.repository.DepartmentsRepository;
import com.sis.service.dto.DepartmentsDTO;
import com.sis.service.mapper.DepartmentsMapper;
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
 * Integration tests for the {@link DepartmentsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DepartmentsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

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

    private static final String ENTITY_API_URL = "/api/departments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DepartmentsRepository departmentsRepository;

    @Autowired
    private DepartmentsMapper departmentsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDepartmentsMockMvc;

    private Departments departments;

    private Departments insertedDepartments;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Departments createEntity() {
        return new Departments()
            .name(DEFAULT_NAME)
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
    public static Departments createUpdatedEntity() {
        return new Departments()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        departments = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedDepartments != null) {
            departmentsRepository.delete(insertedDepartments);
            insertedDepartments = null;
        }
    }

    @Test
    @Transactional
    void createDepartments() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Departments
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);
        var returnedDepartmentsDTO = om.readValue(
            restDepartmentsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(departmentsDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            DepartmentsDTO.class
        );

        // Validate the Departments in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedDepartments = departmentsMapper.toEntity(returnedDepartmentsDTO);
        assertDepartmentsUpdatableFieldsEquals(returnedDepartments, getPersistedDepartments(returnedDepartments));

        insertedDepartments = returnedDepartments;
    }

    @Test
    @Transactional
    void createDepartmentsWithExistingId() throws Exception {
        // Create the Departments with an existing ID
        departments.setId(1L);
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDepartmentsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(departmentsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDepartmentses() throws Exception {
        // Initialize the database
        insertedDepartments = departmentsRepository.saveAndFlush(departments);

        // Get all the departmentsList
        restDepartmentsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(departments.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getDepartments() throws Exception {
        // Initialize the database
        insertedDepartments = departmentsRepository.saveAndFlush(departments);

        // Get the departments
        restDepartmentsMockMvc
            .perform(get(ENTITY_API_URL_ID, departments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(departments.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDepartments() throws Exception {
        // Get the departments
        restDepartmentsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDepartments() throws Exception {
        // Initialize the database
        insertedDepartments = departmentsRepository.saveAndFlush(departments);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the departments
        Departments updatedDepartments = departmentsRepository.findById(departments.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDepartments are not directly saved in db
        em.detach(updatedDepartments);
        updatedDepartments
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(updatedDepartments);

        restDepartmentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, departmentsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(departmentsDTO))
            )
            .andExpect(status().isOk());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDepartmentsToMatchAllProperties(updatedDepartments);
    }

    @Test
    @Transactional
    void putNonExistingDepartments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departments.setId(longCount.incrementAndGet());

        // Create the Departments
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDepartmentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, departmentsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(departmentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDepartments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departments.setId(longCount.incrementAndGet());

        // Create the Departments
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartmentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(departmentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDepartments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departments.setId(longCount.incrementAndGet());

        // Create the Departments
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartmentsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(departmentsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDepartmentsWithPatch() throws Exception {
        // Initialize the database
        insertedDepartments = departmentsRepository.saveAndFlush(departments);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the departments using partial update
        Departments partialUpdatedDepartments = new Departments();
        partialUpdatedDepartments.setId(departments.getId());

        partialUpdatedDepartments.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).createdBy(UPDATED_CREATED_BY);

        restDepartmentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDepartments.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDepartments))
            )
            .andExpect(status().isOk());

        // Validate the Departments in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDepartmentsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDepartments, departments),
            getPersistedDepartments(departments)
        );
    }

    @Test
    @Transactional
    void fullUpdateDepartmentsWithPatch() throws Exception {
        // Initialize the database
        insertedDepartments = departmentsRepository.saveAndFlush(departments);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the departments using partial update
        Departments partialUpdatedDepartments = new Departments();
        partialUpdatedDepartments.setId(departments.getId());

        partialUpdatedDepartments
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restDepartmentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDepartments.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDepartments))
            )
            .andExpect(status().isOk());

        // Validate the Departments in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDepartmentsUpdatableFieldsEquals(partialUpdatedDepartments, getPersistedDepartments(partialUpdatedDepartments));
    }

    @Test
    @Transactional
    void patchNonExistingDepartments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departments.setId(longCount.incrementAndGet());

        // Create the Departments
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDepartmentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, departmentsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(departmentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDepartments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departments.setId(longCount.incrementAndGet());

        // Create the Departments
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartmentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(departmentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDepartments() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departments.setId(longCount.incrementAndGet());

        // Create the Departments
        DepartmentsDTO departmentsDTO = departmentsMapper.toDto(departments);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartmentsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(departmentsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Departments in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDepartments() throws Exception {
        // Initialize the database
        insertedDepartments = departmentsRepository.saveAndFlush(departments);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the departments
        restDepartmentsMockMvc
            .perform(delete(ENTITY_API_URL_ID, departments.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return departmentsRepository.count();
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

    protected Departments getPersistedDepartments(Departments departments) {
        return departmentsRepository.findById(departments.getId()).orElseThrow();
    }

    protected void assertPersistedDepartmentsToMatchAllProperties(Departments expectedDepartments) {
        assertDepartmentsAllPropertiesEquals(expectedDepartments, getPersistedDepartments(expectedDepartments));
    }

    protected void assertPersistedDepartmentsToMatchUpdatableProperties(Departments expectedDepartments) {
        assertDepartmentsAllUpdatablePropertiesEquals(expectedDepartments, getPersistedDepartments(expectedDepartments));
    }
}
