package com.sis.service.impl;

import com.sis.domain.AccountPayables;
import com.sis.repository.AccountPayablesRepository;
import com.sis.service.AccountPayablesService;
import com.sis.service.dto.AccountPayablesDTO;
import com.sis.service.mapper.AccountPayablesMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.AccountPayables}.
 */
@Service
@Transactional
public class AccountPayablesServiceImpl implements AccountPayablesService {

    private static final Logger LOG = LoggerFactory.getLogger(AccountPayablesServiceImpl.class);

    private final AccountPayablesRepository accountPayablesRepository;

    private final AccountPayablesMapper accountPayablesMapper;

    public AccountPayablesServiceImpl(AccountPayablesRepository accountPayablesRepository, AccountPayablesMapper accountPayablesMapper) {
        this.accountPayablesRepository = accountPayablesRepository;
        this.accountPayablesMapper = accountPayablesMapper;
    }

    @Override
    public AccountPayablesDTO save(AccountPayablesDTO accountPayablesDTO) {
        LOG.debug("Request to save AccountPayables : {}", accountPayablesDTO);
        AccountPayables accountPayables = accountPayablesMapper.toEntity(accountPayablesDTO);
        accountPayables = accountPayablesRepository.save(accountPayables);
        return accountPayablesMapper.toDto(accountPayables);
    }

    @Override
    public AccountPayablesDTO update(AccountPayablesDTO accountPayablesDTO) {
        LOG.debug("Request to update AccountPayables : {}", accountPayablesDTO);
        AccountPayables accountPayables = accountPayablesMapper.toEntity(accountPayablesDTO);
        accountPayables = accountPayablesRepository.save(accountPayables);
        return accountPayablesMapper.toDto(accountPayables);
    }

    @Override
    public Optional<AccountPayablesDTO> partialUpdate(AccountPayablesDTO accountPayablesDTO) {
        LOG.debug("Request to partially update AccountPayables : {}", accountPayablesDTO);

        return accountPayablesRepository
            .findById(accountPayablesDTO.getId())
            .map(existingAccountPayables -> {
                accountPayablesMapper.partialUpdate(existingAccountPayables, accountPayablesDTO);

                return existingAccountPayables;
            })
            .map(accountPayablesRepository::save)
            .map(accountPayablesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountPayablesDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AccountPayableses");
        return accountPayablesRepository.findAll(pageable).map(accountPayablesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AccountPayablesDTO> findOne(Long id) {
        LOG.debug("Request to get AccountPayables : {}", id);
        return accountPayablesRepository.findById(id).map(accountPayablesMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete AccountPayables : {}", id);
        accountPayablesRepository.deleteById(id);
    }
}
