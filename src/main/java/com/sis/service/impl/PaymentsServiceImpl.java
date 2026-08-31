package com.sis.service.impl;

import com.sis.domain.Payments;
import com.sis.repository.PaymentsRepository;
import com.sis.service.PaymentsService;
import com.sis.service.dto.PaymentsDTO;
import com.sis.service.mapper.PaymentsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.sis.domain.Payments}.
 */
@Service
@Transactional
public class PaymentsServiceImpl implements PaymentsService {

    private static final Logger LOG = LoggerFactory.getLogger(PaymentsServiceImpl.class);

    private final PaymentsRepository paymentsRepository;

    private final PaymentsMapper paymentsMapper;

    public PaymentsServiceImpl(PaymentsRepository paymentsRepository, PaymentsMapper paymentsMapper) {
        this.paymentsRepository = paymentsRepository;
        this.paymentsMapper = paymentsMapper;
    }

    @Override
    public PaymentsDTO save(PaymentsDTO paymentsDTO) {
        LOG.debug("Request to save Payments : {}", paymentsDTO);
        Payments payments = paymentsMapper.toEntity(paymentsDTO);
        payments = paymentsRepository.save(payments);
        return paymentsMapper.toDto(payments);
    }

    @Override
    public PaymentsDTO update(PaymentsDTO paymentsDTO) {
        LOG.debug("Request to update Payments : {}", paymentsDTO);
        Payments payments = paymentsMapper.toEntity(paymentsDTO);
        payments = paymentsRepository.save(payments);
        return paymentsMapper.toDto(payments);
    }

    @Override
    public Optional<PaymentsDTO> partialUpdate(PaymentsDTO paymentsDTO) {
        LOG.debug("Request to partially update Payments : {}", paymentsDTO);

        return paymentsRepository
            .findById(paymentsDTO.getId())
            .map(existingPayments -> {
                paymentsMapper.partialUpdate(existingPayments, paymentsDTO);

                return existingPayments;
            })
            .map(paymentsRepository::save)
            .map(paymentsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentsDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Paymentses");
        return paymentsRepository.findAll(pageable).map(paymentsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PaymentsDTO> findOne(Long id) {
        LOG.debug("Request to get Payments : {}", id);
        return paymentsRepository.findById(id).map(paymentsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Payments : {}", id);
        paymentsRepository.deleteById(id);
    }
}
