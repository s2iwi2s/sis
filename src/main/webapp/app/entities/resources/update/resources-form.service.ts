import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IResources, NewResources } from '../resources.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResources for edit and NewResourcesFormGroupInput for create.
 */
type ResourcesFormGroupInput = IResources | PartialWithRequiredKeyOf<NewResources>;

type ResourcesFormDefaults = Pick<NewResources, 'id'>;

type ResourcesFormGroupContent = {
  id: FormControl<IResources['id'] | NewResources['id']>;
  fileName: FormControl<IResources['fileName']>;
  fileNameOnServer: FormControl<IResources['fileNameOnServer']>;
  document: FormControl<IResources['document']>;
  documentContentType: FormControl<IResources['documentContentType']>;
  strategies: FormControl<IResources['strategies']>;
  assessment: FormControl<IResources['assessment']>;
};

export type ResourcesFormGroup = FormGroup<ResourcesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResourcesFormService {
  createResourcesFormGroup(resources: ResourcesFormGroupInput = { id: null }): ResourcesFormGroup {
    const resourcesRawValue = {
      ...this.getFormDefaults(),
      ...resources,
    };
    return new FormGroup<ResourcesFormGroupContent>({
      id: new FormControl(
        { value: resourcesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fileName: new FormControl(resourcesRawValue.fileName, {
        validators: [Validators.maxLength(50)],
      }),
      fileNameOnServer: new FormControl(resourcesRawValue.fileNameOnServer),
      document: new FormControl(resourcesRawValue.document),
      documentContentType: new FormControl(resourcesRawValue.documentContentType),
      strategies: new FormControl(resourcesRawValue.strategies),
      assessment: new FormControl(resourcesRawValue.assessment),
    });
  }

  getResources(form: ResourcesFormGroup): IResources | NewResources {
    return form.getRawValue() as IResources | NewResources;
  }

  resetForm(form: ResourcesFormGroup, resources: ResourcesFormGroupInput): void {
    const resourcesRawValue = { ...this.getFormDefaults(), ...resources };
    form.reset(
      {
        ...resourcesRawValue,
        id: { value: resourcesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ResourcesFormDefaults {
    return {
      id: null,
    };
  }
}
