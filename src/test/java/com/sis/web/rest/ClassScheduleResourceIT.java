package com.sis.web.rest;

import static com.sis.domain.ClassScheduleAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.ClassSchedule;
import com.sis.repository.ClassScheduleRepository;
import com.sis.service.dto.ClassScheduleDTO;
import com.sis.service.mapper.ClassScheduleMapper;
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
 * Integration tests for the {@link ClassScheduleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClassScheduleResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/class-schedules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ClassScheduleRepository classScheduleRepository;

    @Autowired
    private ClassScheduleMapper classScheduleMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClassScheduleMockMvc;

    private ClassSchedule classSchedule;

    private ClassSchedule insertedClassSchedule;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClassSchedule createEntity() {
        return new ClassSchedule().name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClassSchedule createUpdatedEntity() {
        return new ClassSchedule().name(UPDATED_NAME);
    }

    @BeforeEach
    void initTest() {
        classSchedule = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedClassSchedule != null) {
            classScheduleRepository.delete(insertedClassSchedule);
            insertedClassSchedule = null;
        }
    }

    @Test
    @Transactional
    void createClassSchedule() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ClassSchedule
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);
        var returnedClassScheduleDTO = om.readValue(
            restClassScheduleMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(classScheduleDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ClassScheduleDTO.class
        );

        // Validate the ClassSchedule in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedClassSchedule = classScheduleMapper.toEntity(returnedClassScheduleDTO);
        assertClassScheduleUpdatableFieldsEquals(returnedClassSchedule, getPersistedClassSchedule(returnedClassSchedule));

        insertedClassSchedule = returnedClassSchedule;
    }

    @Test
    @Transactional
    void createClassScheduleWithExistingId() throws Exception {
        // Create the ClassSchedule with an existing ID
        classSchedule.setId(1L);
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClassScheduleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(classScheduleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClassSchedules() throws Exception {
        // Initialize the database
        insertedClassSchedule = classScheduleRepository.saveAndFlush(classSchedule);

        // Get all the classScheduleList
        restClassScheduleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classSchedule.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getClassSchedule() throws Exception {
        // Initialize the database
        insertedClassSchedule = classScheduleRepository.saveAndFlush(classSchedule);

        // Get the classSchedule
        restClassScheduleMockMvc
            .perform(get(ENTITY_API_URL_ID, classSchedule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(classSchedule.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingClassSchedule() throws Exception {
        // Get the classSchedule
        restClassScheduleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClassSchedule() throws Exception {
        // Initialize the database
        insertedClassSchedule = classScheduleRepository.saveAndFlush(classSchedule);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classSchedule
        ClassSchedule updatedClassSchedule = classScheduleRepository.findById(classSchedule.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedClassSchedule are not directly saved in db
        em.detach(updatedClassSchedule);
        updatedClassSchedule.name(UPDATED_NAME);
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(updatedClassSchedule);

        restClassScheduleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, classScheduleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(classScheduleDTO))
            )
            .andExpect(status().isOk());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedClassScheduleToMatchAllProperties(updatedClassSchedule);
    }

    @Test
    @Transactional
    void putNonExistingClassSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classSchedule.setId(longCount.incrementAndGet());

        // Create the ClassSchedule
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassScheduleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, classScheduleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(classScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClassSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classSchedule.setId(longCount.incrementAndGet());

        // Create the ClassSchedule
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassScheduleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(classScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClassSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classSchedule.setId(longCount.incrementAndGet());

        // Create the ClassSchedule
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassScheduleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(classScheduleDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClassScheduleWithPatch() throws Exception {
        // Initialize the database
        insertedClassSchedule = classScheduleRepository.saveAndFlush(classSchedule);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classSchedule using partial update
        ClassSchedule partialUpdatedClassSchedule = new ClassSchedule();
        partialUpdatedClassSchedule.setId(classSchedule.getId());

        restClassScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassSchedule.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClassSchedule))
            )
            .andExpect(status().isOk());

        // Validate the ClassSchedule in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClassScheduleUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedClassSchedule, classSchedule),
            getPersistedClassSchedule(classSchedule)
        );
    }

    @Test
    @Transactional
    void fullUpdateClassScheduleWithPatch() throws Exception {
        // Initialize the database
        insertedClassSchedule = classScheduleRepository.saveAndFlush(classSchedule);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classSchedule using partial update
        ClassSchedule partialUpdatedClassSchedule = new ClassSchedule();
        partialUpdatedClassSchedule.setId(classSchedule.getId());

        partialUpdatedClassSchedule.name(UPDATED_NAME);

        restClassScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassSchedule.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClassSchedule))
            )
            .andExpect(status().isOk());

        // Validate the ClassSchedule in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClassScheduleUpdatableFieldsEquals(partialUpdatedClassSchedule, getPersistedClassSchedule(partialUpdatedClassSchedule));
    }

    @Test
    @Transactional
    void patchNonExistingClassSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classSchedule.setId(longCount.incrementAndGet());

        // Create the ClassSchedule
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, classScheduleDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(classScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClassSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classSchedule.setId(longCount.incrementAndGet());

        // Create the ClassSchedule
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(classScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClassSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classSchedule.setId(longCount.incrementAndGet());

        // Create the ClassSchedule
        ClassScheduleDTO classScheduleDTO = classScheduleMapper.toDto(classSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassScheduleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(classScheduleDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClassSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClassSchedule() throws Exception {
        // Initialize the database
        insertedClassSchedule = classScheduleRepository.saveAndFlush(classSchedule);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the classSchedule
        restClassScheduleMockMvc
            .perform(delete(ENTITY_API_URL_ID, classSchedule.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return classScheduleRepository.count();
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

    protected ClassSchedule getPersistedClassSchedule(ClassSchedule classSchedule) {
        return classScheduleRepository.findById(classSchedule.getId()).orElseThrow();
    }

    protected void assertPersistedClassScheduleToMatchAllProperties(ClassSchedule expectedClassSchedule) {
        assertClassScheduleAllPropertiesEquals(expectedClassSchedule, getPersistedClassSchedule(expectedClassSchedule));
    }

    protected void assertPersistedClassScheduleToMatchUpdatableProperties(ClassSchedule expectedClassSchedule) {
        assertClassScheduleAllUpdatablePropertiesEquals(expectedClassSchedule, getPersistedClassSchedule(expectedClassSchedule));
    }
}
