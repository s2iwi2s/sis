package com.sis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sis.IntegrationTest;
import com.sis.domain.Student;
import com.sis.repository.StudentRepository;
import com.sis.service.StudentService;
import com.sis.service.dto.StudentDTO;
import com.sis.service.mapper.StudentMapper;
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
 * Integration tests for the {@link StudentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class StudentResourceIT {

    private static final String DEFAULT_LRN = "AAAAAAAAAA";
    private static final String UPDATED_LRN = "BBBBBBBBBB";

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MIDDLE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MIDDLE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EXT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EXT_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_BIRTH_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_BIRTH_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_BIRTH_PLACE = "AAAAAAAAAA";
    private static final String UPDATED_BIRTH_PLACE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NO = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NO = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS_1 = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS_1 = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS_2 = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS_2 = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_ZIP_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ZIP_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY = "AAAAAAAAAA";
    private static final String UPDATED_COUNTRY = "BBBBBBBBBB";

    private static final String DEFAULT_NATIONALITY = "AAAAAAAAAA";
    private static final String UPDATED_NATIONALITY = "BBBBBBBBBB";

    private static final String DEFAULT_MOTHER_TONGUE = "AAAAAAAAAA";
    private static final String UPDATED_MOTHER_TONGUE = "BBBBBBBBBB";

    private static final String DEFAULT_RELIGION = "AAAAAAAAAA";
    private static final String UPDATED_RELIGION = "BBBBBBBBBB";

    private static final String DEFAULT_FATHERS_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FATHERS_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FATHERS_MIDDLE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FATHERS_MIDDLE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FATHERS_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FATHERS_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FATHERS_EXT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FATHERS_EXT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FATHERS_OCCUPATION = "AAAAAAAAAA";
    private static final String UPDATED_FATHERS_OCCUPATION = "BBBBBBBBBB";

    private static final String DEFAULT_FATHERS_CONTACTS = "AAAAAAAAAA";
    private static final String UPDATED_FATHERS_CONTACTS = "BBBBBBBBBB";

    private static final String DEFAULT_MOTHERS_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MOTHERS_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MOTHERS_MIDDLE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MOTHERS_MIDDLE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MOTHERS_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MOTHERS_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MOTHERS_OCCUPATION = "AAAAAAAAAA";
    private static final String UPDATED_MOTHERS_OCCUPATION = "BBBBBBBBBB";

    private static final String DEFAULT_MOTHERS_CONTACTS = "AAAAAAAAAA";
    private static final String UPDATED_MOTHERS_CONTACTS = "BBBBBBBBBB";

    private static final String DEFAULT_GUARDIAN_FULL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GUARDIAN_FULL_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_GUARDIAN_CONTACTS = "AAAAAAAAAA";
    private static final String UPDATED_GUARDIAN_CONTACTS = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/students";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StudentRepository studentRepository;

    @Mock
    private StudentRepository studentRepositoryMock;

    @Autowired
    private StudentMapper studentMapper;

    @Mock
    private StudentService studentServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStudentMockMvc;

    private Student student;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Student createEntity(EntityManager em) {
        Student student = new Student()
            .lrn(DEFAULT_LRN)
            .firstName(DEFAULT_FIRST_NAME)
            .middleName(DEFAULT_MIDDLE_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .extName(DEFAULT_EXT_NAME)
            .birthDate(DEFAULT_BIRTH_DATE)
            .birthPlace(DEFAULT_BIRTH_PLACE)
            .contactNo(DEFAULT_CONTACT_NO)
            .address1(DEFAULT_ADDRESS_1)
            .address2(DEFAULT_ADDRESS_2)
            .city(DEFAULT_CITY)
            .zipCode(DEFAULT_ZIP_CODE)
            .country(DEFAULT_COUNTRY)
            .nationality(DEFAULT_NATIONALITY)
            .motherTongue(DEFAULT_MOTHER_TONGUE)
            .religion(DEFAULT_RELIGION)
            .fathersLastName(DEFAULT_FATHERS_LAST_NAME)
            .fathersMiddleName(DEFAULT_FATHERS_MIDDLE_NAME)
            .fathersFirstName(DEFAULT_FATHERS_FIRST_NAME)
            .fathersExtName(DEFAULT_FATHERS_EXT_NAME)
            .fathersOccupation(DEFAULT_FATHERS_OCCUPATION)
            .fathersContacts(DEFAULT_FATHERS_CONTACTS)
            .mothersLastName(DEFAULT_MOTHERS_LAST_NAME)
            .mothersMiddleName(DEFAULT_MOTHERS_MIDDLE_NAME)
            .mothersFirstName(DEFAULT_MOTHERS_FIRST_NAME)
            .mothersOccupation(DEFAULT_MOTHERS_OCCUPATION)
            .mothersContacts(DEFAULT_MOTHERS_CONTACTS)
            .guardianFullName(DEFAULT_GUARDIAN_FULL_NAME)
            .guardianContacts(DEFAULT_GUARDIAN_CONTACTS)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return student;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Student createUpdatedEntity(EntityManager em) {
        Student student = new Student()
            .lrn(UPDATED_LRN)
            .firstName(UPDATED_FIRST_NAME)
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .extName(UPDATED_EXT_NAME)
            .birthDate(UPDATED_BIRTH_DATE)
            .birthPlace(UPDATED_BIRTH_PLACE)
            .contactNo(UPDATED_CONTACT_NO)
            .address1(UPDATED_ADDRESS_1)
            .address2(UPDATED_ADDRESS_2)
            .city(UPDATED_CITY)
            .zipCode(UPDATED_ZIP_CODE)
            .country(UPDATED_COUNTRY)
            .nationality(UPDATED_NATIONALITY)
            .motherTongue(UPDATED_MOTHER_TONGUE)
            .religion(UPDATED_RELIGION)
            .fathersLastName(UPDATED_FATHERS_LAST_NAME)
            .fathersMiddleName(UPDATED_FATHERS_MIDDLE_NAME)
            .fathersFirstName(UPDATED_FATHERS_FIRST_NAME)
            .fathersExtName(UPDATED_FATHERS_EXT_NAME)
            .fathersOccupation(UPDATED_FATHERS_OCCUPATION)
            .fathersContacts(UPDATED_FATHERS_CONTACTS)
            .mothersLastName(UPDATED_MOTHERS_LAST_NAME)
            .mothersMiddleName(UPDATED_MOTHERS_MIDDLE_NAME)
            .mothersFirstName(UPDATED_MOTHERS_FIRST_NAME)
            .mothersOccupation(UPDATED_MOTHERS_OCCUPATION)
            .mothersContacts(UPDATED_MOTHERS_CONTACTS)
            .guardianFullName(UPDATED_GUARDIAN_FULL_NAME)
            .guardianContacts(UPDATED_GUARDIAN_CONTACTS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        return student;
    }

    @BeforeEach
    public void initTest() {
        student = createEntity(em);
    }

    @Test
    @Transactional
    void createStudent() throws Exception {
        int databaseSizeBeforeCreate = studentRepository.findAll().size();
        // Create the Student
        StudentDTO studentDTO = studentMapper.toDto(student);
        restStudentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentDTO)))
            .andExpect(status().isCreated());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeCreate + 1);
        Student testStudent = studentList.get(studentList.size() - 1);
        assertThat(testStudent.getLrn()).isEqualTo(DEFAULT_LRN);
        assertThat(testStudent.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testStudent.getMiddleName()).isEqualTo(DEFAULT_MIDDLE_NAME);
        assertThat(testStudent.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testStudent.getExtName()).isEqualTo(DEFAULT_EXT_NAME);
        assertThat(testStudent.getBirthDate()).isEqualTo(DEFAULT_BIRTH_DATE);
        assertThat(testStudent.getBirthPlace()).isEqualTo(DEFAULT_BIRTH_PLACE);
        assertThat(testStudent.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
        assertThat(testStudent.getAddress1()).isEqualTo(DEFAULT_ADDRESS_1);
        assertThat(testStudent.getAddress2()).isEqualTo(DEFAULT_ADDRESS_2);
        assertThat(testStudent.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testStudent.getZipCode()).isEqualTo(DEFAULT_ZIP_CODE);
        assertThat(testStudent.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testStudent.getNationality()).isEqualTo(DEFAULT_NATIONALITY);
        assertThat(testStudent.getMotherTongue()).isEqualTo(DEFAULT_MOTHER_TONGUE);
        assertThat(testStudent.getReligion()).isEqualTo(DEFAULT_RELIGION);
        assertThat(testStudent.getFathersLastName()).isEqualTo(DEFAULT_FATHERS_LAST_NAME);
        assertThat(testStudent.getFathersMiddleName()).isEqualTo(DEFAULT_FATHERS_MIDDLE_NAME);
        assertThat(testStudent.getFathersFirstName()).isEqualTo(DEFAULT_FATHERS_FIRST_NAME);
        assertThat(testStudent.getFathersExtName()).isEqualTo(DEFAULT_FATHERS_EXT_NAME);
        assertThat(testStudent.getFathersOccupation()).isEqualTo(DEFAULT_FATHERS_OCCUPATION);
        assertThat(testStudent.getFathersContacts()).isEqualTo(DEFAULT_FATHERS_CONTACTS);
        assertThat(testStudent.getMothersLastName()).isEqualTo(DEFAULT_MOTHERS_LAST_NAME);
        assertThat(testStudent.getMothersMiddleName()).isEqualTo(DEFAULT_MOTHERS_MIDDLE_NAME);
        assertThat(testStudent.getMothersFirstName()).isEqualTo(DEFAULT_MOTHERS_FIRST_NAME);
        assertThat(testStudent.getMothersOccupation()).isEqualTo(DEFAULT_MOTHERS_OCCUPATION);
        assertThat(testStudent.getMothersContacts()).isEqualTo(DEFAULT_MOTHERS_CONTACTS);
        assertThat(testStudent.getGuardianFullName()).isEqualTo(DEFAULT_GUARDIAN_FULL_NAME);
        assertThat(testStudent.getGuardianContacts()).isEqualTo(DEFAULT_GUARDIAN_CONTACTS);
        assertThat(testStudent.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testStudent.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testStudent.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testStudent.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void createStudentWithExistingId() throws Exception {
        // Create the Student with an existing ID
        student.setId(1L);
        StudentDTO studentDTO = studentMapper.toDto(student);

        int databaseSizeBeforeCreate = studentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStudents() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        // Get all the studentList
        restStudentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(student.getId().intValue())))
            .andExpect(jsonPath("$.[*].lrn").value(hasItem(DEFAULT_LRN)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].middleName").value(hasItem(DEFAULT_MIDDLE_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].extName").value(hasItem(DEFAULT_EXT_NAME)))
            .andExpect(jsonPath("$.[*].birthDate").value(hasItem(DEFAULT_BIRTH_DATE.toString())))
            .andExpect(jsonPath("$.[*].birthPlace").value(hasItem(DEFAULT_BIRTH_PLACE)))
            .andExpect(jsonPath("$.[*].contactNo").value(hasItem(DEFAULT_CONTACT_NO)))
            .andExpect(jsonPath("$.[*].address1").value(hasItem(DEFAULT_ADDRESS_1)))
            .andExpect(jsonPath("$.[*].address2").value(hasItem(DEFAULT_ADDRESS_2)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].zipCode").value(hasItem(DEFAULT_ZIP_CODE)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY)))
            .andExpect(jsonPath("$.[*].nationality").value(hasItem(DEFAULT_NATIONALITY)))
            .andExpect(jsonPath("$.[*].motherTongue").value(hasItem(DEFAULT_MOTHER_TONGUE)))
            .andExpect(jsonPath("$.[*].religion").value(hasItem(DEFAULT_RELIGION)))
            .andExpect(jsonPath("$.[*].fathersLastName").value(hasItem(DEFAULT_FATHERS_LAST_NAME)))
            .andExpect(jsonPath("$.[*].fathersMiddleName").value(hasItem(DEFAULT_FATHERS_MIDDLE_NAME)))
            .andExpect(jsonPath("$.[*].fathersFirstName").value(hasItem(DEFAULT_FATHERS_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].fathersExtName").value(hasItem(DEFAULT_FATHERS_EXT_NAME)))
            .andExpect(jsonPath("$.[*].fathersOccupation").value(hasItem(DEFAULT_FATHERS_OCCUPATION)))
            .andExpect(jsonPath("$.[*].fathersContacts").value(hasItem(DEFAULT_FATHERS_CONTACTS)))
            .andExpect(jsonPath("$.[*].mothersLastName").value(hasItem(DEFAULT_MOTHERS_LAST_NAME)))
            .andExpect(jsonPath("$.[*].mothersMiddleName").value(hasItem(DEFAULT_MOTHERS_MIDDLE_NAME)))
            .andExpect(jsonPath("$.[*].mothersFirstName").value(hasItem(DEFAULT_MOTHERS_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].mothersOccupation").value(hasItem(DEFAULT_MOTHERS_OCCUPATION)))
            .andExpect(jsonPath("$.[*].mothersContacts").value(hasItem(DEFAULT_MOTHERS_CONTACTS)))
            .andExpect(jsonPath("$.[*].guardianFullName").value(hasItem(DEFAULT_GUARDIAN_FULL_NAME)))
            .andExpect(jsonPath("$.[*].guardianContacts").value(hasItem(DEFAULT_GUARDIAN_CONTACTS)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStudentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(studentServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStudentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(studentServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStudentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(studentServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStudentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(studentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getStudent() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        // Get the student
        restStudentMockMvc
            .perform(get(ENTITY_API_URL_ID, student.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(student.getId().intValue()))
            .andExpect(jsonPath("$.lrn").value(DEFAULT_LRN))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.middleName").value(DEFAULT_MIDDLE_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.extName").value(DEFAULT_EXT_NAME))
            .andExpect(jsonPath("$.birthDate").value(DEFAULT_BIRTH_DATE.toString()))
            .andExpect(jsonPath("$.birthPlace").value(DEFAULT_BIRTH_PLACE))
            .andExpect(jsonPath("$.contactNo").value(DEFAULT_CONTACT_NO))
            .andExpect(jsonPath("$.address1").value(DEFAULT_ADDRESS_1))
            .andExpect(jsonPath("$.address2").value(DEFAULT_ADDRESS_2))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.zipCode").value(DEFAULT_ZIP_CODE))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY))
            .andExpect(jsonPath("$.nationality").value(DEFAULT_NATIONALITY))
            .andExpect(jsonPath("$.motherTongue").value(DEFAULT_MOTHER_TONGUE))
            .andExpect(jsonPath("$.religion").value(DEFAULT_RELIGION))
            .andExpect(jsonPath("$.fathersLastName").value(DEFAULT_FATHERS_LAST_NAME))
            .andExpect(jsonPath("$.fathersMiddleName").value(DEFAULT_FATHERS_MIDDLE_NAME))
            .andExpect(jsonPath("$.fathersFirstName").value(DEFAULT_FATHERS_FIRST_NAME))
            .andExpect(jsonPath("$.fathersExtName").value(DEFAULT_FATHERS_EXT_NAME))
            .andExpect(jsonPath("$.fathersOccupation").value(DEFAULT_FATHERS_OCCUPATION))
            .andExpect(jsonPath("$.fathersContacts").value(DEFAULT_FATHERS_CONTACTS))
            .andExpect(jsonPath("$.mothersLastName").value(DEFAULT_MOTHERS_LAST_NAME))
            .andExpect(jsonPath("$.mothersMiddleName").value(DEFAULT_MOTHERS_MIDDLE_NAME))
            .andExpect(jsonPath("$.mothersFirstName").value(DEFAULT_MOTHERS_FIRST_NAME))
            .andExpect(jsonPath("$.mothersOccupation").value(DEFAULT_MOTHERS_OCCUPATION))
            .andExpect(jsonPath("$.mothersContacts").value(DEFAULT_MOTHERS_CONTACTS))
            .andExpect(jsonPath("$.guardianFullName").value(DEFAULT_GUARDIAN_FULL_NAME))
            .andExpect(jsonPath("$.guardianContacts").value(DEFAULT_GUARDIAN_CONTACTS))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingStudent() throws Exception {
        // Get the student
        restStudentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStudent() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        int databaseSizeBeforeUpdate = studentRepository.findAll().size();

        // Update the student
        Student updatedStudent = studentRepository.findById(student.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStudent are not directly saved in db
        em.detach(updatedStudent);
        updatedStudent
            .lrn(UPDATED_LRN)
            .firstName(UPDATED_FIRST_NAME)
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .extName(UPDATED_EXT_NAME)
            .birthDate(UPDATED_BIRTH_DATE)
            .birthPlace(UPDATED_BIRTH_PLACE)
            .contactNo(UPDATED_CONTACT_NO)
            .address1(UPDATED_ADDRESS_1)
            .address2(UPDATED_ADDRESS_2)
            .city(UPDATED_CITY)
            .zipCode(UPDATED_ZIP_CODE)
            .country(UPDATED_COUNTRY)
            .nationality(UPDATED_NATIONALITY)
            .motherTongue(UPDATED_MOTHER_TONGUE)
            .religion(UPDATED_RELIGION)
            .fathersLastName(UPDATED_FATHERS_LAST_NAME)
            .fathersMiddleName(UPDATED_FATHERS_MIDDLE_NAME)
            .fathersFirstName(UPDATED_FATHERS_FIRST_NAME)
            .fathersExtName(UPDATED_FATHERS_EXT_NAME)
            .fathersOccupation(UPDATED_FATHERS_OCCUPATION)
            .fathersContacts(UPDATED_FATHERS_CONTACTS)
            .mothersLastName(UPDATED_MOTHERS_LAST_NAME)
            .mothersMiddleName(UPDATED_MOTHERS_MIDDLE_NAME)
            .mothersFirstName(UPDATED_MOTHERS_FIRST_NAME)
            .mothersOccupation(UPDATED_MOTHERS_OCCUPATION)
            .mothersContacts(UPDATED_MOTHERS_CONTACTS)
            .guardianFullName(UPDATED_GUARDIAN_FULL_NAME)
            .guardianContacts(UPDATED_GUARDIAN_CONTACTS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        StudentDTO studentDTO = studentMapper.toDto(updatedStudent);

        restStudentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studentDTO))
            )
            .andExpect(status().isOk());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
        Student testStudent = studentList.get(studentList.size() - 1);
        assertThat(testStudent.getLrn()).isEqualTo(UPDATED_LRN);
        assertThat(testStudent.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testStudent.getMiddleName()).isEqualTo(UPDATED_MIDDLE_NAME);
        assertThat(testStudent.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testStudent.getExtName()).isEqualTo(UPDATED_EXT_NAME);
        assertThat(testStudent.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testStudent.getBirthPlace()).isEqualTo(UPDATED_BIRTH_PLACE);
        assertThat(testStudent.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
        assertThat(testStudent.getAddress1()).isEqualTo(UPDATED_ADDRESS_1);
        assertThat(testStudent.getAddress2()).isEqualTo(UPDATED_ADDRESS_2);
        assertThat(testStudent.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testStudent.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testStudent.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testStudent.getNationality()).isEqualTo(UPDATED_NATIONALITY);
        assertThat(testStudent.getMotherTongue()).isEqualTo(UPDATED_MOTHER_TONGUE);
        assertThat(testStudent.getReligion()).isEqualTo(UPDATED_RELIGION);
        assertThat(testStudent.getFathersLastName()).isEqualTo(UPDATED_FATHERS_LAST_NAME);
        assertThat(testStudent.getFathersMiddleName()).isEqualTo(UPDATED_FATHERS_MIDDLE_NAME);
        assertThat(testStudent.getFathersFirstName()).isEqualTo(UPDATED_FATHERS_FIRST_NAME);
        assertThat(testStudent.getFathersExtName()).isEqualTo(UPDATED_FATHERS_EXT_NAME);
        assertThat(testStudent.getFathersOccupation()).isEqualTo(UPDATED_FATHERS_OCCUPATION);
        assertThat(testStudent.getFathersContacts()).isEqualTo(UPDATED_FATHERS_CONTACTS);
        assertThat(testStudent.getMothersLastName()).isEqualTo(UPDATED_MOTHERS_LAST_NAME);
        assertThat(testStudent.getMothersMiddleName()).isEqualTo(UPDATED_MOTHERS_MIDDLE_NAME);
        assertThat(testStudent.getMothersFirstName()).isEqualTo(UPDATED_MOTHERS_FIRST_NAME);
        assertThat(testStudent.getMothersOccupation()).isEqualTo(UPDATED_MOTHERS_OCCUPATION);
        assertThat(testStudent.getMothersContacts()).isEqualTo(UPDATED_MOTHERS_CONTACTS);
        assertThat(testStudent.getGuardianFullName()).isEqualTo(UPDATED_GUARDIAN_FULL_NAME);
        assertThat(testStudent.getGuardianContacts()).isEqualTo(UPDATED_GUARDIAN_CONTACTS);
        assertThat(testStudent.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testStudent.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testStudent.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testStudent.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingStudent() throws Exception {
        int databaseSizeBeforeUpdate = studentRepository.findAll().size();
        student.setId(longCount.incrementAndGet());

        // Create the Student
        StudentDTO studentDTO = studentMapper.toDto(student);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStudent() throws Exception {
        int databaseSizeBeforeUpdate = studentRepository.findAll().size();
        student.setId(longCount.incrementAndGet());

        // Create the Student
        StudentDTO studentDTO = studentMapper.toDto(student);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStudent() throws Exception {
        int databaseSizeBeforeUpdate = studentRepository.findAll().size();
        student.setId(longCount.incrementAndGet());

        // Create the Student
        StudentDTO studentDTO = studentMapper.toDto(student);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStudentWithPatch() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        int databaseSizeBeforeUpdate = studentRepository.findAll().size();

        // Update the student using partial update
        Student partialUpdatedStudent = new Student();
        partialUpdatedStudent.setId(student.getId());

        partialUpdatedStudent
            .lrn(UPDATED_LRN)
            .birthDate(UPDATED_BIRTH_DATE)
            .city(UPDATED_CITY)
            .country(UPDATED_COUNTRY)
            .fathersFirstName(UPDATED_FATHERS_FIRST_NAME)
            .fathersExtName(UPDATED_FATHERS_EXT_NAME)
            .fathersOccupation(UPDATED_FATHERS_OCCUPATION)
            .fathersContacts(UPDATED_FATHERS_CONTACTS)
            .mothersLastName(UPDATED_MOTHERS_LAST_NAME)
            .mothersOccupation(UPDATED_MOTHERS_OCCUPATION)
            .mothersContacts(UPDATED_MOTHERS_CONTACTS)
            .guardianFullName(UPDATED_GUARDIAN_FULL_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restStudentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudent))
            )
            .andExpect(status().isOk());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
        Student testStudent = studentList.get(studentList.size() - 1);
        assertThat(testStudent.getLrn()).isEqualTo(UPDATED_LRN);
        assertThat(testStudent.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testStudent.getMiddleName()).isEqualTo(DEFAULT_MIDDLE_NAME);
        assertThat(testStudent.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testStudent.getExtName()).isEqualTo(DEFAULT_EXT_NAME);
        assertThat(testStudent.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testStudent.getBirthPlace()).isEqualTo(DEFAULT_BIRTH_PLACE);
        assertThat(testStudent.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
        assertThat(testStudent.getAddress1()).isEqualTo(DEFAULT_ADDRESS_1);
        assertThat(testStudent.getAddress2()).isEqualTo(DEFAULT_ADDRESS_2);
        assertThat(testStudent.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testStudent.getZipCode()).isEqualTo(DEFAULT_ZIP_CODE);
        assertThat(testStudent.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testStudent.getNationality()).isEqualTo(DEFAULT_NATIONALITY);
        assertThat(testStudent.getMotherTongue()).isEqualTo(DEFAULT_MOTHER_TONGUE);
        assertThat(testStudent.getReligion()).isEqualTo(DEFAULT_RELIGION);
        assertThat(testStudent.getFathersLastName()).isEqualTo(DEFAULT_FATHERS_LAST_NAME);
        assertThat(testStudent.getFathersMiddleName()).isEqualTo(DEFAULT_FATHERS_MIDDLE_NAME);
        assertThat(testStudent.getFathersFirstName()).isEqualTo(UPDATED_FATHERS_FIRST_NAME);
        assertThat(testStudent.getFathersExtName()).isEqualTo(UPDATED_FATHERS_EXT_NAME);
        assertThat(testStudent.getFathersOccupation()).isEqualTo(UPDATED_FATHERS_OCCUPATION);
        assertThat(testStudent.getFathersContacts()).isEqualTo(UPDATED_FATHERS_CONTACTS);
        assertThat(testStudent.getMothersLastName()).isEqualTo(UPDATED_MOTHERS_LAST_NAME);
        assertThat(testStudent.getMothersMiddleName()).isEqualTo(DEFAULT_MOTHERS_MIDDLE_NAME);
        assertThat(testStudent.getMothersFirstName()).isEqualTo(DEFAULT_MOTHERS_FIRST_NAME);
        assertThat(testStudent.getMothersOccupation()).isEqualTo(UPDATED_MOTHERS_OCCUPATION);
        assertThat(testStudent.getMothersContacts()).isEqualTo(UPDATED_MOTHERS_CONTACTS);
        assertThat(testStudent.getGuardianFullName()).isEqualTo(UPDATED_GUARDIAN_FULL_NAME);
        assertThat(testStudent.getGuardianContacts()).isEqualTo(DEFAULT_GUARDIAN_CONTACTS);
        assertThat(testStudent.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testStudent.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testStudent.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testStudent.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateStudentWithPatch() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        int databaseSizeBeforeUpdate = studentRepository.findAll().size();

        // Update the student using partial update
        Student partialUpdatedStudent = new Student();
        partialUpdatedStudent.setId(student.getId());

        partialUpdatedStudent
            .lrn(UPDATED_LRN)
            .firstName(UPDATED_FIRST_NAME)
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .extName(UPDATED_EXT_NAME)
            .birthDate(UPDATED_BIRTH_DATE)
            .birthPlace(UPDATED_BIRTH_PLACE)
            .contactNo(UPDATED_CONTACT_NO)
            .address1(UPDATED_ADDRESS_1)
            .address2(UPDATED_ADDRESS_2)
            .city(UPDATED_CITY)
            .zipCode(UPDATED_ZIP_CODE)
            .country(UPDATED_COUNTRY)
            .nationality(UPDATED_NATIONALITY)
            .motherTongue(UPDATED_MOTHER_TONGUE)
            .religion(UPDATED_RELIGION)
            .fathersLastName(UPDATED_FATHERS_LAST_NAME)
            .fathersMiddleName(UPDATED_FATHERS_MIDDLE_NAME)
            .fathersFirstName(UPDATED_FATHERS_FIRST_NAME)
            .fathersExtName(UPDATED_FATHERS_EXT_NAME)
            .fathersOccupation(UPDATED_FATHERS_OCCUPATION)
            .fathersContacts(UPDATED_FATHERS_CONTACTS)
            .mothersLastName(UPDATED_MOTHERS_LAST_NAME)
            .mothersMiddleName(UPDATED_MOTHERS_MIDDLE_NAME)
            .mothersFirstName(UPDATED_MOTHERS_FIRST_NAME)
            .mothersOccupation(UPDATED_MOTHERS_OCCUPATION)
            .mothersContacts(UPDATED_MOTHERS_CONTACTS)
            .guardianFullName(UPDATED_GUARDIAN_FULL_NAME)
            .guardianContacts(UPDATED_GUARDIAN_CONTACTS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restStudentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudent))
            )
            .andExpect(status().isOk());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
        Student testStudent = studentList.get(studentList.size() - 1);
        assertThat(testStudent.getLrn()).isEqualTo(UPDATED_LRN);
        assertThat(testStudent.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testStudent.getMiddleName()).isEqualTo(UPDATED_MIDDLE_NAME);
        assertThat(testStudent.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testStudent.getExtName()).isEqualTo(UPDATED_EXT_NAME);
        assertThat(testStudent.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testStudent.getBirthPlace()).isEqualTo(UPDATED_BIRTH_PLACE);
        assertThat(testStudent.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
        assertThat(testStudent.getAddress1()).isEqualTo(UPDATED_ADDRESS_1);
        assertThat(testStudent.getAddress2()).isEqualTo(UPDATED_ADDRESS_2);
        assertThat(testStudent.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testStudent.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testStudent.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testStudent.getNationality()).isEqualTo(UPDATED_NATIONALITY);
        assertThat(testStudent.getMotherTongue()).isEqualTo(UPDATED_MOTHER_TONGUE);
        assertThat(testStudent.getReligion()).isEqualTo(UPDATED_RELIGION);
        assertThat(testStudent.getFathersLastName()).isEqualTo(UPDATED_FATHERS_LAST_NAME);
        assertThat(testStudent.getFathersMiddleName()).isEqualTo(UPDATED_FATHERS_MIDDLE_NAME);
        assertThat(testStudent.getFathersFirstName()).isEqualTo(UPDATED_FATHERS_FIRST_NAME);
        assertThat(testStudent.getFathersExtName()).isEqualTo(UPDATED_FATHERS_EXT_NAME);
        assertThat(testStudent.getFathersOccupation()).isEqualTo(UPDATED_FATHERS_OCCUPATION);
        assertThat(testStudent.getFathersContacts()).isEqualTo(UPDATED_FATHERS_CONTACTS);
        assertThat(testStudent.getMothersLastName()).isEqualTo(UPDATED_MOTHERS_LAST_NAME);
        assertThat(testStudent.getMothersMiddleName()).isEqualTo(UPDATED_MOTHERS_MIDDLE_NAME);
        assertThat(testStudent.getMothersFirstName()).isEqualTo(UPDATED_MOTHERS_FIRST_NAME);
        assertThat(testStudent.getMothersOccupation()).isEqualTo(UPDATED_MOTHERS_OCCUPATION);
        assertThat(testStudent.getMothersContacts()).isEqualTo(UPDATED_MOTHERS_CONTACTS);
        assertThat(testStudent.getGuardianFullName()).isEqualTo(UPDATED_GUARDIAN_FULL_NAME);
        assertThat(testStudent.getGuardianContacts()).isEqualTo(UPDATED_GUARDIAN_CONTACTS);
        assertThat(testStudent.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testStudent.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testStudent.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testStudent.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingStudent() throws Exception {
        int databaseSizeBeforeUpdate = studentRepository.findAll().size();
        student.setId(longCount.incrementAndGet());

        // Create the Student
        StudentDTO studentDTO = studentMapper.toDto(student);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, studentDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStudent() throws Exception {
        int databaseSizeBeforeUpdate = studentRepository.findAll().size();
        student.setId(longCount.incrementAndGet());

        // Create the Student
        StudentDTO studentDTO = studentMapper.toDto(student);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStudent() throws Exception {
        int databaseSizeBeforeUpdate = studentRepository.findAll().size();
        student.setId(longCount.incrementAndGet());

        // Create the Student
        StudentDTO studentDTO = studentMapper.toDto(student);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(studentDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStudent() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        int databaseSizeBeforeDelete = studentRepository.findAll().size();

        // Delete the student
        restStudentMockMvc
            .perform(delete(ENTITY_API_URL_ID, student.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
