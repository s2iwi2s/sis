import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type OrgFormDefaults = Pick<NewOrg, 'id'>;

type OrgFormGroupContent = {
  id: FormControl<IOrg['id'] | NewOrg['id']>;
  name: FormControl<IOrg['name']>;
  logo: FormControl<IOrg['logo']>;
  address: FormControl<IOrg['address']>;
  currSchYr: FormControl<IOrg['currSchYr']>;
};

export type OrgFormGroup = FormGroup<OrgFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrgFormService {
  createOrgFormGroup(org: OrgFormGroupInput = { id: null }): OrgFormGroup {
    const orgRawValue = {
      ...this.getFormDefaults(),
      ...org,
    };
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
      currSchYr: new FormControl(orgRawValue.currSchYr),
    });
  }

  getOrg(form: OrgFormGroup): IOrg | NewOrg {
    return form.getRawValue() as IOrg | NewOrg;
  }

  resetForm(form: OrgFormGroup, org: OrgFormGroupInput): void {
    const orgRawValue = { ...this.getFormDefaults(), ...org };
    form.reset(
      {
        ...orgRawValue,
        id: { value: orgRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OrgFormDefaults {
    return {
      id: null,
    };
  }
}
