package com.sis.web.rest;

import static com.sis.domain.CourseScheduleAsserts.*;
import static com.sis.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sis.IntegrationTest;
import com.sis.domain.CourseSchedule;
import com.sis.repository.CourseScheduleRepository;
import com.sis.service.dto.CourseScheduleDTO;
import com.sis.service.mapper.CourseScheduleMapper;
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
 * Integration tests for the {@link CourseScheduleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CourseScheduleResourceIT {

    private static final String DEFAULT_ROOM = "AAAAAAAAAA";
    private static final String UPDATED_ROOM = "BBBBBBBBBB";

    private static final Integer DEFAULT_WEEK_DAY = 1;
    private static final Integer UPDATED_WEEK_DAY = 2;

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

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

    private static final String ENTITY_API_URL = "/api/course-schedules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CourseScheduleRepository courseScheduleRepository;

    @Autowired
    private CourseScheduleMapper courseScheduleMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCourseScheduleMockMvc;

    private CourseSchedule courseSchedule;

    private CourseSchedule insertedCourseSchedule;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CourseSchedule createEntity() {
        return new CourseSchedule()
            .room(DEFAULT_ROOM)
            .weekDay(DEFAULT_WEEK_DAY)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME)
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
    public static CourseSchedule createUpdatedEntity() {
        return new CourseSchedule()
            .room(UPDATED_ROOM)
            .weekDay(UPDATED_WEEK_DAY)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        courseSchedule = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCourseSchedule != null) {
            courseScheduleRepository.delete(insertedCourseSchedule);
            insertedCourseSchedule = null;
        }
    }

    @Test
    @Transactional
    void createCourseSchedule() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CourseSchedule
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);
        var returnedCourseScheduleDTO = om.readValue(
            restCourseScheduleMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseScheduleDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CourseScheduleDTO.class
        );

        // Validate the CourseSchedule in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedCourseSchedule = courseScheduleMapper.toEntity(returnedCourseScheduleDTO);
        assertCourseScheduleUpdatableFieldsEquals(returnedCourseSchedule, getPersistedCourseSchedule(returnedCourseSchedule));

        insertedCourseSchedule = returnedCourseSchedule;
    }

    @Test
    @Transactional
    void createCourseScheduleWithExistingId() throws Exception {
        // Create the CourseSchedule with an existing ID
        courseSchedule.setId(1L);
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCourseScheduleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseScheduleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCourseSchedules() throws Exception {
        // Initialize the database
        insertedCourseSchedule = courseScheduleRepository.saveAndFlush(courseSchedule);

        // Get all the courseScheduleList
        restCourseScheduleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(courseSchedule.getId().intValue())))
            .andExpect(jsonPath("$.[*].room").value(hasItem(DEFAULT_ROOM)))
            .andExpect(jsonPath("$.[*].weekDay").value(hasItem(DEFAULT_WEEK_DAY)))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getCourseSchedule() throws Exception {
        // Initialize the database
        insertedCourseSchedule = courseScheduleRepository.saveAndFlush(courseSchedule);

        // Get the courseSchedule
        restCourseScheduleMockMvc
            .perform(get(ENTITY_API_URL_ID, courseSchedule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(courseSchedule.getId().intValue()))
            .andExpect(jsonPath("$.room").value(DEFAULT_ROOM))
            .andExpect(jsonPath("$.weekDay").value(DEFAULT_WEEK_DAY))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCourseSchedule() throws Exception {
        // Get the courseSchedule
        restCourseScheduleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCourseSchedule() throws Exception {
        // Initialize the database
        insertedCourseSchedule = courseScheduleRepository.saveAndFlush(courseSchedule);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the courseSchedule
        CourseSchedule updatedCourseSchedule = courseScheduleRepository.findById(courseSchedule.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCourseSchedule are not directly saved in db
        em.detach(updatedCourseSchedule);
        updatedCourseSchedule
            .room(UPDATED_ROOM)
            .weekDay(UPDATED_WEEK_DAY)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(updatedCourseSchedule);

        restCourseScheduleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courseScheduleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(courseScheduleDTO))
            )
            .andExpect(status().isOk());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCourseScheduleToMatchAllProperties(updatedCourseSchedule);
    }

    @Test
    @Transactional
    void putNonExistingCourseSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseSchedule.setId(longCount.incrementAndGet());

        // Create the CourseSchedule
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseScheduleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courseScheduleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(courseScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCourseSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseSchedule.setId(longCount.incrementAndGet());

        // Create the CourseSchedule
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseScheduleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(courseScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCourseSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseSchedule.setId(longCount.incrementAndGet());

        // Create the CourseSchedule
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseScheduleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseScheduleDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCourseScheduleWithPatch() throws Exception {
        // Initialize the database
        insertedCourseSchedule = courseScheduleRepository.saveAndFlush(courseSchedule);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the courseSchedule using partial update
        CourseSchedule partialUpdatedCourseSchedule = new CourseSchedule();
        partialUpdatedCourseSchedule.setId(courseSchedule.getId());

        partialUpdatedCourseSchedule.endTime(UPDATED_END_TIME).description(UPDATED_DESCRIPTION).lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restCourseScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseSchedule.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCourseSchedule))
            )
            .andExpect(status().isOk());

        // Validate the CourseSchedule in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCourseScheduleUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCourseSchedule, courseSchedule),
            getPersistedCourseSchedule(courseSchedule)
        );
    }

    @Test
    @Transactional
    void fullUpdateCourseScheduleWithPatch() throws Exception {
        // Initialize the database
        insertedCourseSchedule = courseScheduleRepository.saveAndFlush(courseSchedule);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the courseSchedule using partial update
        CourseSchedule partialUpdatedCourseSchedule = new CourseSchedule();
        partialUpdatedCourseSchedule.setId(courseSchedule.getId());

        partialUpdatedCourseSchedule
            .room(UPDATED_ROOM)
            .weekDay(UPDATED_WEEK_DAY)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCourseScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseSchedule.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCourseSchedule))
            )
            .andExpect(status().isOk());

        // Validate the CourseSchedule in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCourseScheduleUpdatableFieldsEquals(partialUpdatedCourseSchedule, getPersistedCourseSchedule(partialUpdatedCourseSchedule));
    }

    @Test
    @Transactional
    void patchNonExistingCourseSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseSchedule.setId(longCount.incrementAndGet());

        // Create the CourseSchedule
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, courseScheduleDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(courseScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCourseSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseSchedule.setId(longCount.incrementAndGet());

        // Create the CourseSchedule
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseScheduleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(courseScheduleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCourseSchedule() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseSchedule.setId(longCount.incrementAndGet());

        // Create the CourseSchedule
        CourseScheduleDTO courseScheduleDTO = courseScheduleMapper.toDto(courseSchedule);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseScheduleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(courseScheduleDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseSchedule in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCourseSchedule() throws Exception {
        // Initialize the database
        insertedCourseSchedule = courseScheduleRepository.saveAndFlush(courseSchedule);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the courseSchedule
        restCourseScheduleMockMvc
            .perform(delete(ENTITY_API_URL_ID, courseSchedule.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return courseScheduleRepository.count();
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

    protected CourseSchedule getPersistedCourseSchedule(CourseSchedule courseSchedule) {
        return courseScheduleRepository.findById(courseSchedule.getId()).orElseThrow();
    }

    protected void assertPersistedCourseScheduleToMatchAllProperties(CourseSchedule expectedCourseSchedule) {
        assertCourseScheduleAllPropertiesEquals(expectedCourseSchedule, getPersistedCourseSchedule(expectedCourseSchedule));
    }

    protected void assertPersistedCourseScheduleToMatchUpdatableProperties(CourseSchedule expectedCourseSchedule) {
        assertCourseScheduleAllUpdatablePropertiesEquals(expectedCourseSchedule, getPersistedCourseSchedule(expectedCourseSchedule));
    }
}
