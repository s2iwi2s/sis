package com.sis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sis.IntegrationTest;
import com.sis.domain.Instructor;
import com.sis.repository.InstructorRepository;
import com.sis.service.InstructorService;
import com.sis.service.dto.InstructorDTO;
import com.sis.service.mapper.InstructorMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link InstructorResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class InstructorResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MIDDLE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MIDDLE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_HIRE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_HIRE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_SALARY = 1L;
    private static final Long UPDATED_SALARY = 2L;

    private static final Long DEFAULT_COMMISSION_PCT = 1L;
    private static final Long UPDATED_COMMISSION_PCT = 2L;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/instructors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private InstructorRepository instructorRepository;

    @Mock
    private InstructorRepository instructorRepositoryMock;

    @Autowired
    private InstructorMapper instructorMapper;

    @Mock
    private InstructorService instructorServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInstructorMockMvc;

    private Instructor instructor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Instructor createEntity(EntityManager em) {
        Instructor instructor = new Instructor()
            .firstName(DEFAULT_FIRST_NAME)
            .middleName(DEFAULT_MIDDLE_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .hireDate(DEFAULT_HIRE_DATE)
            .salary(DEFAULT_SALARY)
            .commissionPct(DEFAULT_COMMISSION_PCT)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return instructor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Instructor createUpdatedEntity(EntityManager em) {
        Instructor instructor = new Instructor()
            .firstName(UPDATED_FIRST_NAME)
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        return instructor;
    }

    @BeforeEach
    public void initTest() {
        instructor = createEntity(em);
    }

    @Test
    @Transactional
    void createInstructor() throws Exception {
        int databaseSizeBeforeCreate = instructorRepository.findAll().size();
        // Create the Instructor
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);
        restInstructorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(instructorDTO)))
            .andExpect(status().isCreated());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeCreate + 1);
        Instructor testInstructor = instructorList.get(instructorList.size() - 1);
        assertThat(testInstructor.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testInstructor.getMiddleName()).isEqualTo(DEFAULT_MIDDLE_NAME);
        assertThat(testInstructor.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testInstructor.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testInstructor.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testInstructor.getHireDate()).isEqualTo(DEFAULT_HIRE_DATE);
        assertThat(testInstructor.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testInstructor.getCommissionPct()).isEqualTo(DEFAULT_COMMISSION_PCT);
        assertThat(testInstructor.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testInstructor.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testInstructor.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testInstructor.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void createInstructorWithExistingId() throws Exception {
        // Create the Instructor with an existing ID
        instructor.setId(1L);
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);

        int databaseSizeBeforeCreate = instructorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInstructorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(instructorDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInstructors() throws Exception {
        // Initialize the database
        instructorRepository.saveAndFlush(instructor);

        // Get all the instructorList
        restInstructorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(instructor.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].middleName").value(hasItem(DEFAULT_MIDDLE_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].hireDate").value(hasItem(DEFAULT_HIRE_DATE.toString())))
            .andExpect(jsonPath("$.[*].salary").value(hasItem(DEFAULT_SALARY.intValue())))
            .andExpect(jsonPath("$.[*].commissionPct").value(hasItem(DEFAULT_COMMISSION_PCT.intValue())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllInstructorsWithEagerRelationshipsIsEnabled() throws Exception {
        when(instructorServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restInstructorMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(instructorServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllInstructorsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(instructorServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restInstructorMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(instructorRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getInstructor() throws Exception {
        // Initialize the database
        instructorRepository.saveAndFlush(instructor);

        // Get the instructor
        restInstructorMockMvc
            .perform(get(ENTITY_API_URL_ID, instructor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(instructor.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.middleName").value(DEFAULT_MIDDLE_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.hireDate").value(DEFAULT_HIRE_DATE.toString()))
            .andExpect(jsonPath("$.salary").value(DEFAULT_SALARY.intValue()))
            .andExpect(jsonPath("$.commissionPct").value(DEFAULT_COMMISSION_PCT.intValue()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingInstructor() throws Exception {
        // Get the instructor
        restInstructorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInstructor() throws Exception {
        // Initialize the database
        instructorRepository.saveAndFlush(instructor);

        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();

        // Update the instructor
        Instructor updatedInstructor = instructorRepository.findById(instructor.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedInstructor are not directly saved in db
        em.detach(updatedInstructor);
        updatedInstructor
            .firstName(UPDATED_FIRST_NAME)
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        InstructorDTO instructorDTO = instructorMapper.toDto(updatedInstructor);

        restInstructorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, instructorDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(instructorDTO))
            )
            .andExpect(status().isOk());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
        Instructor testInstructor = instructorList.get(instructorList.size() - 1);
        assertThat(testInstructor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testInstructor.getMiddleName()).isEqualTo(UPDATED_MIDDLE_NAME);
        assertThat(testInstructor.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testInstructor.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testInstructor.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testInstructor.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testInstructor.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testInstructor.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
        assertThat(testInstructor.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testInstructor.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testInstructor.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testInstructor.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingInstructor() throws Exception {
        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();
        instructor.setId(longCount.incrementAndGet());

        // Create the Instructor
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstructorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, instructorDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(instructorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInstructor() throws Exception {
        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();
        instructor.setId(longCount.incrementAndGet());

        // Create the Instructor
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstructorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(instructorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInstructor() throws Exception {
        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();
        instructor.setId(longCount.incrementAndGet());

        // Create the Instructor
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstructorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(instructorDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInstructorWithPatch() throws Exception {
        // Initialize the database
        instructorRepository.saveAndFlush(instructor);

        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();

        // Update the instructor using partial update
        Instructor partialUpdatedInstructor = new Instructor();
        partialUpdatedInstructor.setId(instructor.getId());

        partialUpdatedInstructor
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .salary(UPDATED_SALARY)
            .createdBy(UPDATED_CREATED_BY)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restInstructorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstructor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstructor))
            )
            .andExpect(status().isOk());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
        Instructor testInstructor = instructorList.get(instructorList.size() - 1);
        assertThat(testInstructor.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testInstructor.getMiddleName()).isEqualTo(UPDATED_MIDDLE_NAME);
        assertThat(testInstructor.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testInstructor.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testInstructor.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testInstructor.getHireDate()).isEqualTo(DEFAULT_HIRE_DATE);
        assertThat(testInstructor.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testInstructor.getCommissionPct()).isEqualTo(DEFAULT_COMMISSION_PCT);
        assertThat(testInstructor.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testInstructor.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testInstructor.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testInstructor.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateInstructorWithPatch() throws Exception {
        // Initialize the database
        instructorRepository.saveAndFlush(instructor);

        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();

        // Update the instructor using partial update
        Instructor partialUpdatedInstructor = new Instructor();
        partialUpdatedInstructor.setId(instructor.getId());

        partialUpdatedInstructor
            .firstName(UPDATED_FIRST_NAME)
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restInstructorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstructor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstructor))
            )
            .andExpect(status().isOk());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
        Instructor testInstructor = instructorList.get(instructorList.size() - 1);
        assertThat(testInstructor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testInstructor.getMiddleName()).isEqualTo(UPDATED_MIDDLE_NAME);
        assertThat(testInstructor.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testInstructor.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testInstructor.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testInstructor.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testInstructor.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testInstructor.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
        assertThat(testInstructor.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testInstructor.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testInstructor.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testInstructor.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingInstructor() throws Exception {
        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();
        instructor.setId(longCount.incrementAndGet());

        // Create the Instructor
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstructorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, instructorDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(instructorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInstructor() throws Exception {
        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();
        instructor.setId(longCount.incrementAndGet());

        // Create the Instructor
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstructorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(instructorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInstructor() throws Exception {
        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();
        instructor.setId(longCount.incrementAndGet());

        // Create the Instructor
        InstructorDTO instructorDTO = instructorMapper.toDto(instructor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstructorMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(instructorDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInstructor() throws Exception {
        // Initialize the database
        instructorRepository.saveAndFlush(instructor);

        int databaseSizeBeforeDelete = instructorRepository.findAll().size();

        // Delete the instructor
        restInstructorMockMvc
            .perform(delete(ENTITY_API_URL_ID, instructor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
