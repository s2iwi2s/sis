import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../payments.test-samples';

import { PaymentsFormService } from './payments-form.service';

describe('Payments Form Service', () => {
  let service: PaymentsFormService;

  beforeEach(() => {
    service = TestBed.inject(PaymentsFormService);
  });

  describe('Service methods', () => {
    describe('createPaymentsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPaymentsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            transactionReference: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            method: expect.any(Object),
            invoices: expect.any(Object),
          }),
        );
      });

      it('passing IPayments should create a new form with FormGroup', () => {
        const formGroup = service.createPaymentsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            transactionReference: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            method: expect.any(Object),
            invoices: expect.any(Object),
          }),
        );
      });
    });

    describe('getPayments', () => {
      it('should return NewPayments for default Payments initial value', () => {
        const formGroup = service.createPaymentsFormGroup(sampleWithNewData);

        const payments = service.getPayments(formGroup);

        expect(payments).toMatchObject(sampleWithNewData);
      });

      it('should return NewPayments for empty Payments initial value', () => {
        const formGroup = service.createPaymentsFormGroup();

        const payments = service.getPayments(formGroup);

        expect(payments).toMatchObject({});
      });

      it('should return IPayments', () => {
        const formGroup = service.createPaymentsFormGroup(sampleWithRequiredData);

        const payments = service.getPayments(formGroup);

        expect(payments).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPayments should not enable id FormControl', () => {
        const formGroup = service.createPaymentsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPayments should disable id FormControl', () => {
        const formGroup = service.createPaymentsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
