import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../strategies.test-samples';

import { StrategiesFormService } from './strategies-form.service';

describe('Strategies Form Service', () => {
  let service: StrategiesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategiesFormService);
  });

  describe('Service methods', () => {
    describe('createStrategiesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStrategiesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            resources: expect.any(Object),
            learningCompetency: expect.any(Object),
          }),
        );
      });

      it('passing IStrategies should create a new form with FormGroup', () => {
        const formGroup = service.createStrategiesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            resources: expect.any(Object),
            learningCompetency: expect.any(Object),
          }),
        );
      });
    });

    describe('getStrategies', () => {
      it('should return NewStrategies for default Strategies initial value', () => {
        const formGroup = service.createStrategiesFormGroup(sampleWithNewData);

        const strategies = service.getStrategies(formGroup) as any;

        expect(strategies).toMatchObject(sampleWithNewData);
      });

      it('should return NewStrategies for empty Strategies initial value', () => {
        const formGroup = service.createStrategiesFormGroup();

        const strategies = service.getStrategies(formGroup) as any;

        expect(strategies).toMatchObject({});
      });

      it('should return IStrategies', () => {
        const formGroup = service.createStrategiesFormGroup(sampleWithRequiredData);

        const strategies = service.getStrategies(formGroup) as any;

        expect(strategies).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStrategies should not enable id FormControl', () => {
        const formGroup = service.createStrategiesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStrategies should disable id FormControl', () => {
        const formGroup = service.createStrategiesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
