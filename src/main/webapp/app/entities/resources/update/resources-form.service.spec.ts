import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../resources.test-samples';

import { ResourcesFormService } from './resources-form.service';

describe('Resources Form Service', () => {
  let service: ResourcesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesFormService);
  });

  describe('Service methods', () => {
    describe('createResourcesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResourcesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fileName: expect.any(Object),
            document: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IResources should create a new form with FormGroup', () => {
        const formGroup = service.createResourcesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fileName: expect.any(Object),
            document: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getResources', () => {
      it('should return NewResources for default Resources initial value', () => {
        const formGroup = service.createResourcesFormGroup(sampleWithNewData);

        const resources = service.getResources(formGroup) as any;

        expect(resources).toMatchObject(sampleWithNewData);
      });

      it('should return NewResources for empty Resources initial value', () => {
        const formGroup = service.createResourcesFormGroup();

        const resources = service.getResources(formGroup) as any;

        expect(resources).toMatchObject({});
      });

      it('should return IResources', () => {
        const formGroup = service.createResourcesFormGroup(sampleWithRequiredData);

        const resources = service.getResources(formGroup) as any;

        expect(resources).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResources should not enable id FormControl', () => {
        const formGroup = service.createResourcesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResources should disable id FormControl', () => {
        const formGroup = service.createResourcesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
