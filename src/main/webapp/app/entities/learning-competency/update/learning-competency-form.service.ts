import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILearningCompetency, NewLearningCompetency } from '../learning-competency.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILearningCompetency for edit and NewLearningCompetencyFormGroupInput for create.
 */
type LearningCompetencyFormGroupInput = ILearningCompetency | PartialWithRequiredKeyOf<NewLearningCompetency>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILearningCompetency | NewLearningCompetency> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type LearningCompetencyFormRawValue = FormValueOf<ILearningCompetency>;

type NewLearningCompetencyFormRawValue = FormValueOf<NewLearningCompetency>;

type LearningCompetencyFormDefaults = Pick<NewLearningCompetency, 'id' | 'createdDate' | 'lastModifiedDate'>;

type LearningCompetencyFormGroupContent = {
  id: FormControl<LearningCompetencyFormRawValue['id'] | NewLearningCompetency['id']>;
  seqNo: FormControl<LearningCompetencyFormRawValue['seqNo']>;
  competencyCode: FormControl<LearningCompetencyFormRawValue['competencyCode']>;
  description: FormControl<LearningCompetencyFormRawValue['description']>;
  createdBy: FormControl<LearningCompetencyFormRawValue['createdBy']>;
  createdDate: FormControl<LearningCompetencyFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<LearningCompetencyFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<LearningCompetencyFormRawValue['lastModifiedDate']>;
  curriculumMap: FormControl<LearningCompetencyFormRawValue['curriculumMap']>;
};

export type LearningCompetencyFormGroup = FormGroup<LearningCompetencyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LearningCompetencyFormService {
  createLearningCompetencyFormGroup(learningCompetency: LearningCompetencyFormGroupInput = { id: null }): LearningCompetencyFormGroup {
    const learningCompetencyRawValue = this.convertLearningCompetencyToLearningCompetencyRawValue({
      ...this.getFormDefaults(),
      ...learningCompetency,
    });
    return new FormGroup<LearningCompetencyFormGroupContent>({
      id: new FormControl(
        { value: learningCompetencyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      seqNo: new FormControl(learningCompetencyRawValue.seqNo),
      competencyCode: new FormControl(learningCompetencyRawValue.competencyCode, {
        validators: [Validators.maxLength(50)],
      }),
      description: new FormControl(learningCompetencyRawValue.description),
      createdBy: new FormControl(learningCompetencyRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(learningCompetencyRawValue.createdDate),
      lastModifiedBy: new FormControl(learningCompetencyRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(learningCompetencyRawValue.lastModifiedDate),
      curriculumMap: new FormControl(learningCompetencyRawValue.curriculumMap),
    });
  }

  getLearningCompetency(form: LearningCompetencyFormGroup): ILearningCompetency | NewLearningCompetency {
    return this.convertLearningCompetencyRawValueToLearningCompetency(
      form.getRawValue() as LearningCompetencyFormRawValue | NewLearningCompetencyFormRawValue,
    );
  }

  resetForm(form: LearningCompetencyFormGroup, learningCompetency: LearningCompetencyFormGroupInput): void {
    const learningCompetencyRawValue = this.convertLearningCompetencyToLearningCompetencyRawValue({
      ...this.getFormDefaults(),
      ...learningCompetency,
    });
    form.reset(
      {
        ...learningCompetencyRawValue,
        id: { value: learningCompetencyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LearningCompetencyFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertLearningCompetencyRawValueToLearningCompetency(
    rawLearningCompetency: LearningCompetencyFormRawValue | NewLearningCompetencyFormRawValue,
  ): ILearningCompetency | NewLearningCompetency {
    return {
      ...rawLearningCompetency,
      createdDate: dayjs(rawLearningCompetency.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawLearningCompetency.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertLearningCompetencyToLearningCompetencyRawValue(
    learningCompetency: ILearningCompetency | (Partial<NewLearningCompetency> & LearningCompetencyFormDefaults),
  ): LearningCompetencyFormRawValue | PartialWithRequiredKeyOf<NewLearningCompetencyFormRawValue> {
    return {
      ...learningCompetency,
      createdDate: learningCompetency.createdDate ? learningCompetency.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: learningCompetency.lastModifiedDate ? learningCompetency.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
