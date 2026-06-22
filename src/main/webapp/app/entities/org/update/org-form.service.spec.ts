import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../org.test-samples';

import { OrgFormService } from './org-form.service';

describe('Org Form Service', () => {
  let service: OrgFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgFormService);
  });

  describe('Service methods', () => {
    describe('createOrgFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrgFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            logo: expect.any(Object),
            address: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            currSchYr: expect.any(Object),
          }),
        );
      });

      it('passing IOrg should create a new form with FormGroup', () => {
        const formGroup = service.createOrgFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            logo: expect.any(Object),
            address: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            currSchYr: expect.any(Object),
          }),
        );
      });
    });

    describe('getOrg', () => {
      it('should return NewOrg for default Org initial value', () => {
        const formGroup = service.createOrgFormGroup(sampleWithNewData);

        const org = service.getOrg(formGroup) as any;

        expect(org).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrg for empty Org initial value', () => {
        const formGroup = service.createOrgFormGroup();

        const org = service.getOrg(formGroup) as any;

        expect(org).toMatchObject({});
      });

      it('should return IOrg', () => {
        const formGroup = service.createOrgFormGroup(sampleWithRequiredData);

        const org = service.getOrg(formGroup) as any;

        expect(org).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrg should not enable id FormControl', () => {
        const formGroup = service.createOrgFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrg should disable id FormControl', () => {
        const formGroup = service.createOrgFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
