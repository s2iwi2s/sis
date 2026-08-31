import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../invoices.test-samples';

import { InvoicesFormService } from './invoices-form.service';

describe('Invoices Form Service', () => {
  let service: InvoicesFormService;

  beforeEach(() => {
    service = TestBed.inject(InvoicesFormService);
  });

  describe('Service methods', () => {
    describe('createInvoicesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInvoicesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dueDate: expect.any(Object),
            amountPaid: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            student: expect.any(Object),
          }),
        );
      });

      it('passing IInvoices should create a new form with FormGroup', () => {
        const formGroup = service.createInvoicesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dueDate: expect.any(Object),
            amountPaid: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            student: expect.any(Object),
          }),
        );
      });
    });

    describe('getInvoices', () => {
      it('should return NewInvoices for default Invoices initial value', () => {
        const formGroup = service.createInvoicesFormGroup(sampleWithNewData);

        const invoices = service.getInvoices(formGroup);

        expect(invoices).toMatchObject(sampleWithNewData);
      });

      it('should return NewInvoices for empty Invoices initial value', () => {
        const formGroup = service.createInvoicesFormGroup();

        const invoices = service.getInvoices(formGroup);

        expect(invoices).toMatchObject({});
      });

      it('should return IInvoices', () => {
        const formGroup = service.createInvoicesFormGroup(sampleWithRequiredData);

        const invoices = service.getInvoices(formGroup);

        expect(invoices).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInvoices should not enable id FormControl', () => {
        const formGroup = service.createInvoicesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInvoices should disable id FormControl', () => {
        const formGroup = service.createInvoicesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
