import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAppConfig, NewAppConfig } from '../app-config.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAppConfig for edit and NewAppConfigFormGroupInput for create.
 */
type AppConfigFormGroupInput = IAppConfig | PartialWithRequiredKeyOf<NewAppConfig>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAppConfig | NewAppConfig> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AppConfigFormRawValue = FormValueOf<IAppConfig>;

type NewAppConfigFormRawValue = FormValueOf<NewAppConfig>;

type AppConfigFormDefaults = Pick<NewAppConfig, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AppConfigFormGroupContent = {
  id: FormControl<AppConfigFormRawValue['id'] | NewAppConfig['id']>;
  code: FormControl<AppConfigFormRawValue['code']>;
  value: FormControl<AppConfigFormRawValue['value']>;
  description: FormControl<AppConfigFormRawValue['description']>;
  json: FormControl<AppConfigFormRawValue['json']>;
  priority: FormControl<AppConfigFormRawValue['priority']>;
  createdBy: FormControl<AppConfigFormRawValue['createdBy']>;
  createdDate: FormControl<AppConfigFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AppConfigFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AppConfigFormRawValue['lastModifiedDate']>;
};

export type AppConfigFormGroup = FormGroup<AppConfigFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppConfigFormService {
  createAppConfigFormGroup(appConfig: AppConfigFormGroupInput = { id: null }): AppConfigFormGroup {
    const appConfigRawValue = this.convertAppConfigToAppConfigRawValue({
      ...this.getFormDefaults(),
      ...appConfig,
    });
    return new FormGroup<AppConfigFormGroupContent>({
      id: new FormControl(
        { value: appConfigRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(appConfigRawValue.code),
      value: new FormControl(appConfigRawValue.value),
      description: new FormControl(appConfigRawValue.description),
      json: new FormControl(appConfigRawValue.json),
      priority: new FormControl(appConfigRawValue.priority),
      createdBy: new FormControl(appConfigRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(appConfigRawValue.createdDate),
      lastModifiedBy: new FormControl(appConfigRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(appConfigRawValue.lastModifiedDate),
    });
  }

  getAppConfig(form: AppConfigFormGroup): IAppConfig | NewAppConfig {
    return this.convertAppConfigRawValueToAppConfig(form.getRawValue() as AppConfigFormRawValue | NewAppConfigFormRawValue);
  }

  resetForm(form: AppConfigFormGroup, appConfig: AppConfigFormGroupInput): void {
    const appConfigRawValue = this.convertAppConfigToAppConfigRawValue({ ...this.getFormDefaults(), ...appConfig });
    form.reset(
      {
        ...appConfigRawValue,
        id: { value: appConfigRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AppConfigFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAppConfigRawValueToAppConfig(rawAppConfig: AppConfigFormRawValue | NewAppConfigFormRawValue): IAppConfig | NewAppConfig {
    return {
      ...rawAppConfig,
      createdDate: dayjs(rawAppConfig.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAppConfig.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAppConfigToAppConfigRawValue(
    appConfig: IAppConfig | (Partial<NewAppConfig> & AppConfigFormDefaults),
  ): AppConfigFormRawValue | PartialWithRequiredKeyOf<NewAppConfigFormRawValue> {
    return {
      ...appConfig,
      createdDate: appConfig.createdDate ? appConfig.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: appConfig.lastModifiedDate ? appConfig.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
