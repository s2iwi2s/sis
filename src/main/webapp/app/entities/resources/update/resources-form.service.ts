import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
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

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IResources | NewResources> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ResourcesFormRawValue = FormValueOf<IResources>;

type NewResourcesFormRawValue = FormValueOf<NewResources>;

type ResourcesFormDefaults = Pick<NewResources, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ResourcesFormGroupContent = {
  id: FormControl<ResourcesFormRawValue['id'] | NewResources['id']>;
  fileName: FormControl<ResourcesFormRawValue['fileName']>;
  fileNameOnServer: FormControl<ResourcesFormRawValue['fileNameOnServer']>;
  document: FormControl<ResourcesFormRawValue['document']>;
  documentContentType: FormControl<ResourcesFormRawValue['documentContentType']>;
  createdBy: FormControl<ResourcesFormRawValue['createdBy']>;
  createdDate: FormControl<ResourcesFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ResourcesFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ResourcesFormRawValue['lastModifiedDate']>;
};

export type ResourcesFormGroup = FormGroup<ResourcesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResourcesFormService {
  createResourcesFormGroup(resources: ResourcesFormGroupInput = { id: null }): ResourcesFormGroup {
    const resourcesRawValue = this.convertResourcesToResourcesRawValue({
      ...this.getFormDefaults(),
      ...resources,
    });
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
      createdBy: new FormControl(resourcesRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(resourcesRawValue.createdDate),
      lastModifiedBy: new FormControl(resourcesRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(resourcesRawValue.lastModifiedDate),
    });
  }

  getResources(form: ResourcesFormGroup): IResources | NewResources {
    return this.convertResourcesRawValueToResources(form.getRawValue() as ResourcesFormRawValue | NewResourcesFormRawValue);
  }

  resetForm(form: ResourcesFormGroup, resources: ResourcesFormGroupInput): void {
    const resourcesRawValue = this.convertResourcesToResourcesRawValue({ ...this.getFormDefaults(), ...resources });
    form.reset(
      {
        ...resourcesRawValue,
        id: { value: resourcesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ResourcesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertResourcesRawValueToResources(rawResources: ResourcesFormRawValue | NewResourcesFormRawValue): IResources | NewResources {
    return {
      ...rawResources,
      createdDate: dayjs(rawResources.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawResources.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertResourcesToResourcesRawValue(
    resources: IResources | (Partial<NewResources> & ResourcesFormDefaults),
  ): ResourcesFormRawValue | PartialWithRequiredKeyOf<NewResourcesFormRawValue> {
    return {
      ...resources,
      createdDate: resources.createdDate ? resources.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: resources.lastModifiedDate ? resources.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
