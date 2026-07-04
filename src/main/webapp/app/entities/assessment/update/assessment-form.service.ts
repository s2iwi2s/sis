import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAssessment, NewAssessment } from '../assessment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAssessment for edit and NewAssessmentFormGroupInput for create.
 */
type AssessmentFormGroupInput = IAssessment | PartialWithRequiredKeyOf<NewAssessment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAssessment | NewAssessment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AssessmentFormRawValue = FormValueOf<IAssessment>;

type NewAssessmentFormRawValue = FormValueOf<NewAssessment>;

type AssessmentFormDefaults = Pick<NewAssessment, 'id' | 'createdDate' | 'lastModifiedDate' | 'resourceses'>;

type AssessmentFormGroupContent = {
  id: FormControl<AssessmentFormRawValue['id'] | NewAssessment['id']>;
  name: FormControl<AssessmentFormRawValue['name']>;
  instruction: FormControl<AssessmentFormRawValue['instruction']>;
  markScheme: FormControl<AssessmentFormRawValue['markScheme']>;
  createdBy: FormControl<AssessmentFormRawValue['createdBy']>;
  createdDate: FormControl<AssessmentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AssessmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AssessmentFormRawValue['lastModifiedDate']>;
  resourceses: FormControl<AssessmentFormRawValue['resourceses']>;
  learningCompetency: FormControl<AssessmentFormRawValue['learningCompetency']>;
};

export type AssessmentFormGroup = FormGroup<AssessmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AssessmentFormService {
  createAssessmentFormGroup(assessment?: AssessmentFormGroupInput): AssessmentFormGroup {
    const assessmentRawValue = this.convertAssessmentToAssessmentRawValue({
      ...this.getFormDefaults(),
      ...(assessment ?? { id: null }),
    });
    return new FormGroup<AssessmentFormGroupContent>({
      id: new FormControl(
        { value: assessmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(assessmentRawValue.name),
      instruction: new FormControl(assessmentRawValue.instruction),
      markScheme: new FormControl(assessmentRawValue.markScheme),
      createdBy: new FormControl(assessmentRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(assessmentRawValue.createdDate),
      lastModifiedBy: new FormControl(assessmentRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(assessmentRawValue.lastModifiedDate),
      resourceses: new FormControl(assessmentRawValue.resourceses ?? []),
      learningCompetency: new FormControl(assessmentRawValue.learningCompetency),
    });
  }

  getAssessment(form: AssessmentFormGroup): IAssessment | NewAssessment {
    return this.convertAssessmentRawValueToAssessment(form.getRawValue());
  }

  resetForm(form: AssessmentFormGroup, assessment: AssessmentFormGroupInput): void {
    const assessmentRawValue = this.convertAssessmentToAssessmentRawValue({ ...this.getFormDefaults(), ...assessment });
    form.reset({
      ...assessmentRawValue,
      id: { value: assessmentRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AssessmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      resourceses: [],
    };
  }

  private convertAssessmentRawValueToAssessment(
    rawAssessment: AssessmentFormRawValue | NewAssessmentFormRawValue,
  ): IAssessment | NewAssessment {
    return {
      ...rawAssessment,
      createdDate: dayjs(rawAssessment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAssessment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAssessmentToAssessmentRawValue(
    assessment: IAssessment | (Partial<NewAssessment> & AssessmentFormDefaults),
  ): AssessmentFormRawValue | PartialWithRequiredKeyOf<NewAssessmentFormRawValue> {
    return {
      ...assessment,
      createdDate: assessment.createdDate ? assessment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: assessment.lastModifiedDate ? assessment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      resourceses: assessment.resourceses ?? [],
    };
  }
}
