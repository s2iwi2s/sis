package com.sis.service.impl;

import com.sis.domain.Org;
import com.sis.repository.OrgRepository;
import com.sis.service.OrgService;
import com.sis.service.dto.OrgDTO;
import com.sis.service.mapper.OrgMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Org}.
 */
@Service
@Transactional
public class OrgServiceImpl implements OrgService {

    private final Logger log = LoggerFactory.getLogger(OrgServiceImpl.class);

    private final OrgRepository orgRepository;

    private final OrgMapper orgMapper;

    public OrgServiceImpl(OrgRepository orgRepository, OrgMapper orgMapper) {
        this.orgRepository = orgRepository;
        this.orgMapper = orgMapper;
    }

    @Override
    public OrgDTO save(OrgDTO orgDTO) {
        log.debug("Request to save Org : {}", orgDTO);
        Org org = orgMapper.toEntity(orgDTO);
        org = orgRepository.save(org);
        return orgMapper.toDto(org);
    }

    @Override
    public OrgDTO update(OrgDTO orgDTO) {
        log.debug("Request to update Org : {}", orgDTO);
        Org org = orgMapper.toEntity(orgDTO);
        org = orgRepository.save(org);
        return orgMapper.toDto(org);
    }

    @Override
    public Optional<OrgDTO> partialUpdate(OrgDTO orgDTO) {
        log.debug("Request to partially update Org : {}", orgDTO);

        return orgRepository
            .findById(orgDTO.getId())
            .map(existingOrg -> {
                orgMapper.partialUpdate(existingOrg, orgDTO);

                return existingOrg;
            })
            .map(orgRepository::save)
            .map(orgMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrgDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Orgs");
        return orgRepository.findAll(pageable).map(orgMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrgDTO> findOne(Long id) {
        log.debug("Request to get Org : {}", id);
        return orgRepository.findById(id).map(orgMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Org : {}", id);
        orgRepository.deleteById(id);
    }
}
