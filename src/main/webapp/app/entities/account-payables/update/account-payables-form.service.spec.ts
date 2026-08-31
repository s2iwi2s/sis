import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../account-payables.test-samples';

import { AccountPayablesFormService } from './account-payables-form.service';

describe('AccountPayables Form Service', () => {
  let service: AccountPayablesFormService;

  beforeEach(() => {
    service = TestBed.inject(AccountPayablesFormService);
  });

  describe('Service methods', () => {
    describe('createAccountPayablesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAccountPayablesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            amount: expect.any(Object),
            priority: expect.any(Object),
            active: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            invoices: expect.any(Object),
            gradeLevelPayables: expect.any(Object),
          }),
        );
      });

      it('passing IAccountPayables should create a new form with FormGroup', () => {
        const formGroup = service.createAccountPayablesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            amount: expect.any(Object),
            priority: expect.any(Object),
            active: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            invoices: expect.any(Object),
            gradeLevelPayables: expect.any(Object),
          }),
        );
      });
    });

    describe('getAccountPayables', () => {
      it('should return NewAccountPayables for default AccountPayables initial value', () => {
        const formGroup = service.createAccountPayablesFormGroup(sampleWithNewData);

        const accountPayables = service.getAccountPayables(formGroup);

        expect(accountPayables).toMatchObject(sampleWithNewData);
      });

      it('should return NewAccountPayables for empty AccountPayables initial value', () => {
        const formGroup = service.createAccountPayablesFormGroup();

        const accountPayables = service.getAccountPayables(formGroup);

        expect(accountPayables).toMatchObject({});
      });

      it('should return IAccountPayables', () => {
        const formGroup = service.createAccountPayablesFormGroup(sampleWithRequiredData);

        const accountPayables = service.getAccountPayables(formGroup);

        expect(accountPayables).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAccountPayables should not enable id FormControl', () => {
        const formGroup = service.createAccountPayablesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAccountPayables should disable id FormControl', () => {
        const formGroup = service.createAccountPayablesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
