package com.sis.web.rest;

import static com.sis.domain.EnrollmentAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.Enrollment;
import com.sis.repository.EnrollmentRepository;
import com.sis.service.dto.EnrollmentDTO;
import com.sis.service.mapper.EnrollmentMapper;
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
 * Integration tests for the {@link EnrollmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EnrollmentResourceIT {

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/enrollments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private EnrollmentMapper enrollmentMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEnrollmentMockMvc;

    private Enrollment enrollment;

    private Enrollment insertedEnrollment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Enrollment createEntity() {
        return new Enrollment()
            .active(DEFAULT_ACTIVE)
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
    public static Enrollment createUpdatedEntity() {
        return new Enrollment()
            .active(UPDATED_ACTIVE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        enrollment = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedEnrollment != null) {
            enrollmentRepository.delete(insertedEnrollment);
            insertedEnrollment = null;
        }
    }

    @Test
    @Transactional
    void createEnrollment() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Enrollment
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);
        var returnedEnrollmentDTO = om.readValue(
            restEnrollmentMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(enrollmentDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            EnrollmentDTO.class
        );

        // Validate the Enrollment in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedEnrollment = enrollmentMapper.toEntity(returnedEnrollmentDTO);
        assertEnrollmentUpdatableFieldsEquals(returnedEnrollment, getPersistedEnrollment(returnedEnrollment));

        insertedEnrollment = returnedEnrollment;
    }

    @Test
    @Transactional
    void createEnrollmentWithExistingId() throws Exception {
        // Create the Enrollment with an existing ID
        enrollment.setId(1L);
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEnrollmentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(enrollmentDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEnrollments() throws Exception {
        // Initialize the database
        insertedEnrollment = enrollmentRepository.saveAndFlush(enrollment);

        // Get all the enrollmentList
        restEnrollmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(enrollment.getId().intValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getEnrollment() throws Exception {
        // Initialize the database
        insertedEnrollment = enrollmentRepository.saveAndFlush(enrollment);

        // Get the enrollment
        restEnrollmentMockMvc
            .perform(get(ENTITY_API_URL_ID, enrollment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(enrollment.getId().intValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEnrollment() throws Exception {
        // Get the enrollment
        restEnrollmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEnrollment() throws Exception {
        // Initialize the database
        insertedEnrollment = enrollmentRepository.saveAndFlush(enrollment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the enrollment
        Enrollment updatedEnrollment = enrollmentRepository.findById(enrollment.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEnrollment are not directly saved in db
        em.detach(updatedEnrollment);
        updatedEnrollment
            .active(UPDATED_ACTIVE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(updatedEnrollment);

        restEnrollmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, enrollmentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(enrollmentDTO))
            )
            .andExpect(status().isOk());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEnrollmentToMatchAllProperties(updatedEnrollment);
    }

    @Test
    @Transactional
    void putNonExistingEnrollment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enrollment.setId(longCount.incrementAndGet());

        // Create the Enrollment
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnrollmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, enrollmentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(enrollmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEnrollment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enrollment.setId(longCount.incrementAndGet());

        // Create the Enrollment
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnrollmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(enrollmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEnrollment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enrollment.setId(longCount.incrementAndGet());

        // Create the Enrollment
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnrollmentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(enrollmentDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEnrollmentWithPatch() throws Exception {
        // Initialize the database
        insertedEnrollment = enrollmentRepository.saveAndFlush(enrollment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the enrollment using partial update
        Enrollment partialUpdatedEnrollment = new Enrollment();
        partialUpdatedEnrollment.setId(enrollment.getId());

        partialUpdatedEnrollment
            .active(UPDATED_ACTIVE)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restEnrollmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnrollment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEnrollment))
            )
            .andExpect(status().isOk());

        // Validate the Enrollment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEnrollmentUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEnrollment, enrollment),
            getPersistedEnrollment(enrollment)
        );
    }

    @Test
    @Transactional
    void fullUpdateEnrollmentWithPatch() throws Exception {
        // Initialize the database
        insertedEnrollment = enrollmentRepository.saveAndFlush(enrollment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the enrollment using partial update
        Enrollment partialUpdatedEnrollment = new Enrollment();
        partialUpdatedEnrollment.setId(enrollment.getId());

        partialUpdatedEnrollment
            .active(UPDATED_ACTIVE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restEnrollmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnrollment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEnrollment))
            )
            .andExpect(status().isOk());

        // Validate the Enrollment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEnrollmentUpdatableFieldsEquals(partialUpdatedEnrollment, getPersistedEnrollment(partialUpdatedEnrollment));
    }

    @Test
    @Transactional
    void patchNonExistingEnrollment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enrollment.setId(longCount.incrementAndGet());

        // Create the Enrollment
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnrollmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, enrollmentDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(enrollmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEnrollment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enrollment.setId(longCount.incrementAndGet());

        // Create the Enrollment
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnrollmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(enrollmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEnrollment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enrollment.setId(longCount.incrementAndGet());

        // Create the Enrollment
        EnrollmentDTO enrollmentDTO = enrollmentMapper.toDto(enrollment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnrollmentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(enrollmentDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Enrollment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEnrollment() throws Exception {
        // Initialize the database
        insertedEnrollment = enrollmentRepository.saveAndFlush(enrollment);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the enrollment
        restEnrollmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, enrollment.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return enrollmentRepository.count();
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

    protected Enrollment getPersistedEnrollment(Enrollment enrollment) {
        return enrollmentRepository.findById(enrollment.getId()).orElseThrow();
    }

    protected void assertPersistedEnrollmentToMatchAllProperties(Enrollment expectedEnrollment) {
        assertEnrollmentAllPropertiesEquals(expectedEnrollment, getPersistedEnrollment(expectedEnrollment));
    }

    protected void assertPersistedEnrollmentToMatchUpdatableProperties(Enrollment expectedEnrollment) {
        assertEnrollmentAllUpdatablePropertiesEquals(expectedEnrollment, getPersistedEnrollment(expectedEnrollment));
    }
}
