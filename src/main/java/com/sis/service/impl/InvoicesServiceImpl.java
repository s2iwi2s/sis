package com.sis.service.impl;

import com.sis.domain.Invoices;
import com.sis.repository.InvoicesRepository;
import com.sis.service.InvoicesService;
import com.sis.service.dto.InvoicesDTO;
import com.sis.service.mapper.InvoicesMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Invoices}.
 */
@Service
@Transactional
public class InvoicesServiceImpl implements InvoicesService {

    private static final Logger LOG = LoggerFactory.getLogger(InvoicesServiceImpl.class);

    private final InvoicesRepository invoicesRepository;

    private final InvoicesMapper invoicesMapper;

    public InvoicesServiceImpl(InvoicesRepository invoicesRepository, InvoicesMapper invoicesMapper) {
        this.invoicesRepository = invoicesRepository;
        this.invoicesMapper = invoicesMapper;
    }

    @Override
    public InvoicesDTO save(InvoicesDTO invoicesDTO) {
        LOG.debug("Request to save Invoices : {}", invoicesDTO);
        Invoices invoices = invoicesMapper.toEntity(invoicesDTO);
        invoices = invoicesRepository.save(invoices);
        return invoicesMapper.toDto(invoices);
    }

    @Override
    public InvoicesDTO update(InvoicesDTO invoicesDTO) {
        LOG.debug("Request to update Invoices : {}", invoicesDTO);
        Invoices invoices = invoicesMapper.toEntity(invoicesDTO);
        invoices = invoicesRepository.save(invoices);
        return invoicesMapper.toDto(invoices);
    }

    @Override
    public Optional<InvoicesDTO> partialUpdate(InvoicesDTO invoicesDTO) {
        LOG.debug("Request to partially update Invoices : {}", invoicesDTO);

        return invoicesRepository
            .findById(invoicesDTO.getId())
            .map(existingInvoices -> {
                invoicesMapper.partialUpdate(existingInvoices, invoicesDTO);

                return existingInvoices;
            })
            .map(invoicesRepository::save)
            .map(invoicesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoicesDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Invoiceses");
        return invoicesRepository.findAll(pageable).map(invoicesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<InvoicesDTO> findOne(Long id) {
        LOG.debug("Request to get Invoices : {}", id);
        return invoicesRepository.findById(id).map(invoicesMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Invoices : {}", id);
        invoicesRepository.deleteById(id);
    }
}
