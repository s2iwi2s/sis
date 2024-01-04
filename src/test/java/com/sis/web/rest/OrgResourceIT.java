package com.sis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sis.IntegrationTest;
import com.sis.domain.Org;
import com.sis.repository.OrgRepository;
import com.sis.service.dto.OrgDTO;
import com.sis.service.mapper.OrgMapper;
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
 * Integration tests for the {@link OrgResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrgResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOGO = "AAAAAAAAAA";
    private static final String UPDATED_LOGO = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/orgs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrgRepository orgRepository;

    @Autowired
    private OrgMapper orgMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrgMockMvc;

    private Org org;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Org createEntity(EntityManager em) {
        Org org = new Org().name(DEFAULT_NAME).logo(DEFAULT_LOGO).address(DEFAULT_ADDRESS);
        return org;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Org createUpdatedEntity(EntityManager em) {
        Org org = new Org().name(UPDATED_NAME).logo(UPDATED_LOGO).address(UPDATED_ADDRESS);
        return org;
    }

    @BeforeEach
    public void initTest() {
        org = createEntity(em);
    }

    @Test
    @Transactional
    void createOrg() throws Exception {
        int databaseSizeBeforeCreate = orgRepository.findAll().size();
        // Create the Org
        OrgDTO orgDTO = orgMapper.toDto(org);
        restOrgMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orgDTO)))
            .andExpect(status().isCreated());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeCreate + 1);
        Org testOrg = orgList.get(orgList.size() - 1);
        assertThat(testOrg.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOrg.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testOrg.getAddress()).isEqualTo(DEFAULT_ADDRESS);
    }

    @Test
    @Transactional
    void createOrgWithExistingId() throws Exception {
        // Create the Org with an existing ID
        org.setId(1L);
        OrgDTO orgDTO = orgMapper.toDto(org);

        int databaseSizeBeforeCreate = orgRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrgMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orgDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrgs() throws Exception {
        // Initialize the database
        orgRepository.saveAndFlush(org);

        // Get all the orgList
        restOrgMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(org.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)));
    }

    @Test
    @Transactional
    void getOrg() throws Exception {
        // Initialize the database
        orgRepository.saveAndFlush(org);

        // Get the org
        restOrgMockMvc
            .perform(get(ENTITY_API_URL_ID, org.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(org.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.logo").value(DEFAULT_LOGO))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS));
    }

    @Test
    @Transactional
    void getNonExistingOrg() throws Exception {
        // Get the org
        restOrgMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrg() throws Exception {
        // Initialize the database
        orgRepository.saveAndFlush(org);

        int databaseSizeBeforeUpdate = orgRepository.findAll().size();

        // Update the org
        Org updatedOrg = orgRepository.findById(org.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOrg are not directly saved in db
        em.detach(updatedOrg);
        updatedOrg.name(UPDATED_NAME).logo(UPDATED_LOGO).address(UPDATED_ADDRESS);
        OrgDTO orgDTO = orgMapper.toDto(updatedOrg);

        restOrgMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orgDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orgDTO))
            )
            .andExpect(status().isOk());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
        Org testOrg = orgList.get(orgList.size() - 1);
        assertThat(testOrg.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOrg.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testOrg.getAddress()).isEqualTo(UPDATED_ADDRESS);
    }

    @Test
    @Transactional
    void putNonExistingOrg() throws Exception {
        int databaseSizeBeforeUpdate = orgRepository.findAll().size();
        org.setId(longCount.incrementAndGet());

        // Create the Org
        OrgDTO orgDTO = orgMapper.toDto(org);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrgMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orgDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orgDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrg() throws Exception {
        int databaseSizeBeforeUpdate = orgRepository.findAll().size();
        org.setId(longCount.incrementAndGet());

        // Create the Org
        OrgDTO orgDTO = orgMapper.toDto(org);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrgMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orgDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrg() throws Exception {
        int databaseSizeBeforeUpdate = orgRepository.findAll().size();
        org.setId(longCount.incrementAndGet());

        // Create the Org
        OrgDTO orgDTO = orgMapper.toDto(org);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrgMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orgDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrgWithPatch() throws Exception {
        // Initialize the database
        orgRepository.saveAndFlush(org);

        int databaseSizeBeforeUpdate = orgRepository.findAll().size();

        // Update the org using partial update
        Org partialUpdatedOrg = new Org();
        partialUpdatedOrg.setId(org.getId());

        partialUpdatedOrg.logo(UPDATED_LOGO).address(UPDATED_ADDRESS);

        restOrgMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrg.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrg))
            )
            .andExpect(status().isOk());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
        Org testOrg = orgList.get(orgList.size() - 1);
        assertThat(testOrg.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOrg.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testOrg.getAddress()).isEqualTo(UPDATED_ADDRESS);
    }

    @Test
    @Transactional
    void fullUpdateOrgWithPatch() throws Exception {
        // Initialize the database
        orgRepository.saveAndFlush(org);

        int databaseSizeBeforeUpdate = orgRepository.findAll().size();

        // Update the org using partial update
        Org partialUpdatedOrg = new Org();
        partialUpdatedOrg.setId(org.getId());

        partialUpdatedOrg.name(UPDATED_NAME).logo(UPDATED_LOGO).address(UPDATED_ADDRESS);

        restOrgMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrg.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrg))
            )
            .andExpect(status().isOk());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
        Org testOrg = orgList.get(orgList.size() - 1);
        assertThat(testOrg.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOrg.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testOrg.getAddress()).isEqualTo(UPDATED_ADDRESS);
    }

    @Test
    @Transactional
    void patchNonExistingOrg() throws Exception {
        int databaseSizeBeforeUpdate = orgRepository.findAll().size();
        org.setId(longCount.incrementAndGet());

        // Create the Org
        OrgDTO orgDTO = orgMapper.toDto(org);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrgMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orgDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orgDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrg() throws Exception {
        int databaseSizeBeforeUpdate = orgRepository.findAll().size();
        org.setId(longCount.incrementAndGet());

        // Create the Org
        OrgDTO orgDTO = orgMapper.toDto(org);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrgMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orgDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrg() throws Exception {
        int databaseSizeBeforeUpdate = orgRepository.findAll().size();
        org.setId(longCount.incrementAndGet());

        // Create the Org
        OrgDTO orgDTO = orgMapper.toDto(org);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrgMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orgDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Org in the database
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrg() throws Exception {
        // Initialize the database
        orgRepository.saveAndFlush(org);

        int databaseSizeBeforeDelete = orgRepository.findAll().size();

        // Delete the org
        restOrgMockMvc.perform(delete(ENTITY_API_URL_ID, org.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Org> orgList = orgRepository.findAll();
        assertThat(orgList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
