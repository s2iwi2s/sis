import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type AppConfigFormDefaults = Pick<NewAppConfig, 'id'>;

type AppConfigFormGroupContent = {
  id: FormControl<IAppConfig['id'] | NewAppConfig['id']>;
  code: FormControl<IAppConfig['code']>;
  value: FormControl<IAppConfig['value']>;
  description: FormControl<IAppConfig['description']>;
  json: FormControl<IAppConfig['json']>;
  priority: FormControl<IAppConfig['priority']>;
  user: FormControl<IAppConfig['user']>;
};

export type AppConfigFormGroup = FormGroup<AppConfigFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppConfigFormService {
  createAppConfigFormGroup(appConfig: AppConfigFormGroupInput = { id: null }): AppConfigFormGroup {
    const appConfigRawValue = {
      ...this.getFormDefaults(),
      ...appConfig,
    };
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
      user: new FormControl(appConfigRawValue.user),
    });
  }

  getAppConfig(form: AppConfigFormGroup): IAppConfig | NewAppConfig {
    return form.getRawValue() as IAppConfig | NewAppConfig;
  }

  resetForm(form: AppConfigFormGroup, appConfig: AppConfigFormGroupInput): void {
    const appConfigRawValue = { ...this.getFormDefaults(), ...appConfig };
    form.reset(
      {
        ...appConfigRawValue,
        id: { value: appConfigRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AppConfigFormDefaults {
    return {
      id: null,
    };
  }
}
