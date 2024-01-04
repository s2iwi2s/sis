import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../app-config.test-samples';

import { AppConfigFormService } from './app-config-form.service';

describe('AppConfig Form Service', () => {
  let service: AppConfigFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppConfigFormService);
  });

  describe('Service methods', () => {
    describe('createAppConfigFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAppConfigFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            value: expect.any(Object),
            description: expect.any(Object),
            json: expect.any(Object),
            priority: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IAppConfig should create a new form with FormGroup', () => {
        const formGroup = service.createAppConfigFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            value: expect.any(Object),
            description: expect.any(Object),
            json: expect.any(Object),
            priority: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getAppConfig', () => {
      it('should return NewAppConfig for default AppConfig initial value', () => {
        const formGroup = service.createAppConfigFormGroup(sampleWithNewData);

        const appConfig = service.getAppConfig(formGroup) as any;

        expect(appConfig).toMatchObject(sampleWithNewData);
      });

      it('should return NewAppConfig for empty AppConfig initial value', () => {
        const formGroup = service.createAppConfigFormGroup();

        const appConfig = service.getAppConfig(formGroup) as any;

        expect(appConfig).toMatchObject({});
      });

      it('should return IAppConfig', () => {
        const formGroup = service.createAppConfigFormGroup(sampleWithRequiredData);

        const appConfig = service.getAppConfig(formGroup) as any;

        expect(appConfig).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAppConfig should not enable id FormControl', () => {
        const formGroup = service.createAppConfigFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAppConfig should disable id FormControl', () => {
        const formGroup = service.createAppConfigFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
