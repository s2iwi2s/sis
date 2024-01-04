import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type LearningCompetencyFormDefaults = Pick<NewLearningCompetency, 'id'>;

type LearningCompetencyFormGroupContent = {
  id: FormControl<ILearningCompetency['id'] | NewLearningCompetency['id']>;
  seqNo: FormControl<ILearningCompetency['seqNo']>;
  competencyCode: FormControl<ILearningCompetency['competencyCode']>;
  description: FormControl<ILearningCompetency['description']>;
  curriculumMap: FormControl<ILearningCompetency['curriculumMap']>;
};

export type LearningCompetencyFormGroup = FormGroup<LearningCompetencyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LearningCompetencyFormService {
  createLearningCompetencyFormGroup(learningCompetency: LearningCompetencyFormGroupInput = { id: null }): LearningCompetencyFormGroup {
    const learningCompetencyRawValue = {
      ...this.getFormDefaults(),
      ...learningCompetency,
    };
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
      curriculumMap: new FormControl(learningCompetencyRawValue.curriculumMap),
    });
  }

  getLearningCompetency(form: LearningCompetencyFormGroup): ILearningCompetency | NewLearningCompetency {
    return form.getRawValue() as ILearningCompetency | NewLearningCompetency;
  }

  resetForm(form: LearningCompetencyFormGroup, learningCompetency: LearningCompetencyFormGroupInput): void {
    const learningCompetencyRawValue = { ...this.getFormDefaults(), ...learningCompetency };
    form.reset(
      {
        ...learningCompetencyRawValue,
        id: { value: learningCompetencyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LearningCompetencyFormDefaults {
    return {
      id: null,
    };
  }
}
