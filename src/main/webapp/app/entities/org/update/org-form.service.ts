import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrg, NewOrg } from '../org.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrg for edit and NewOrgFormGroupInput for create.
 */
type OrgFormGroupInput = IOrg | PartialWithRequiredKeyOf<NewOrg>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOrg | NewOrg> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type OrgFormRawValue = FormValueOf<IOrg>;

type NewOrgFormRawValue = FormValueOf<NewOrg>;

type OrgFormDefaults = Pick<NewOrg, 'id' | 'createdDate' | 'lastModifiedDate'>;

type OrgFormGroupContent = {
  id: FormControl<OrgFormRawValue['id'] | NewOrg['id']>;
  name: FormControl<OrgFormRawValue['name']>;
  logo: FormControl<OrgFormRawValue['logo']>;
  address: FormControl<OrgFormRawValue['address']>;
  createdBy: FormControl<OrgFormRawValue['createdBy']>;
  createdDate: FormControl<OrgFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<OrgFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<OrgFormRawValue['lastModifiedDate']>;
  currSchYr: FormControl<OrgFormRawValue['currSchYr']>;
};

export type OrgFormGroup = FormGroup<OrgFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrgFormService {
  createOrgFormGroup(org: OrgFormGroupInput = { id: null }): OrgFormGroup {
    const orgRawValue = this.convertOrgToOrgRawValue({
      ...this.getFormDefaults(),
      ...org,
    });
    return new FormGroup<OrgFormGroupContent>({
      id: new FormControl(
        { value: orgRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(orgRawValue.name),
      logo: new FormControl(orgRawValue.logo),
      address: new FormControl(orgRawValue.address),
      createdBy: new FormControl(orgRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(orgRawValue.createdDate),
      lastModifiedBy: new FormControl(orgRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(orgRawValue.lastModifiedDate),
      currSchYr: new FormControl(orgRawValue.currSchYr),
    });
  }

  getOrg(form: OrgFormGroup): IOrg | NewOrg {
    return this.convertOrgRawValueToOrg(form.getRawValue() as OrgFormRawValue | NewOrgFormRawValue);
  }

  resetForm(form: OrgFormGroup, org: OrgFormGroupInput): void {
    const orgRawValue = this.convertOrgToOrgRawValue({ ...this.getFormDefaults(), ...org });
    form.reset(
      {
        ...orgRawValue,
        id: { value: orgRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OrgFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertOrgRawValueToOrg(rawOrg: OrgFormRawValue | NewOrgFormRawValue): IOrg | NewOrg {
    return {
      ...rawOrg,
      createdDate: dayjs(rawOrg.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawOrg.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertOrgToOrgRawValue(
    org: IOrg | (Partial<NewOrg> & OrgFormDefaults),
  ): OrgFormRawValue | PartialWithRequiredKeyOf<NewOrgFormRawValue> {
    return {
      ...org,
      createdDate: org.createdDate ? org.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: org.lastModifiedDate ? org.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
