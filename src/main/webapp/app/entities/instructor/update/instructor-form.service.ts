import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInstructor, NewInstructor } from '../instructor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInstructor for edit and NewInstructorFormGroupInput for create.
 */
type InstructorFormGroupInput = IInstructor | PartialWithRequiredKeyOf<NewInstructor>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInstructor | NewInstructor> = Omit<T, 'hireDate' | 'createdDate' | 'lastModifiedDate'> & {
  hireDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type InstructorFormRawValue = FormValueOf<IInstructor>;

type NewInstructorFormRawValue = FormValueOf<NewInstructor>;

type InstructorFormDefaults = Pick<NewInstructor, 'id' | 'hireDate' | 'createdDate' | 'lastModifiedDate' | 'courses'>;

type InstructorFormGroupContent = {
  id: FormControl<InstructorFormRawValue['id'] | NewInstructor['id']>;
  firstName: FormControl<InstructorFormRawValue['firstName']>;
  middleName: FormControl<InstructorFormRawValue['middleName']>;
  lastName: FormControl<InstructorFormRawValue['lastName']>;
  email: FormControl<InstructorFormRawValue['email']>;
  phoneNumber: FormControl<InstructorFormRawValue['phoneNumber']>;
  hireDate: FormControl<InstructorFormRawValue['hireDate']>;
  salary: FormControl<InstructorFormRawValue['salary']>;
  commissionPct: FormControl<InstructorFormRawValue['commissionPct']>;
  createdBy: FormControl<InstructorFormRawValue['createdBy']>;
  createdDate: FormControl<InstructorFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<InstructorFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<InstructorFormRawValue['lastModifiedDate']>;
  gender: FormControl<InstructorFormRawValue['gender']>;
  courses: FormControl<InstructorFormRawValue['courses']>;
};

export type InstructorFormGroup = FormGroup<InstructorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InstructorFormService {
  createInstructorFormGroup(instructor: InstructorFormGroupInput = { id: null }): InstructorFormGroup {
    const instructorRawValue = this.convertInstructorToInstructorRawValue({
      ...this.getFormDefaults(),
      ...instructor,
    });
    return new FormGroup<InstructorFormGroupContent>({
      id: new FormControl(
        { value: instructorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(instructorRawValue.firstName),
      middleName: new FormControl(instructorRawValue.middleName),
      lastName: new FormControl(instructorRawValue.lastName),
      email: new FormControl(instructorRawValue.email),
      phoneNumber: new FormControl(instructorRawValue.phoneNumber),
      hireDate: new FormControl(instructorRawValue.hireDate),
      salary: new FormControl(instructorRawValue.salary),
      commissionPct: new FormControl(instructorRawValue.commissionPct),
      createdBy: new FormControl(instructorRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(instructorRawValue.createdDate),
      lastModifiedBy: new FormControl(instructorRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(instructorRawValue.lastModifiedDate),
      gender: new FormControl(instructorRawValue.gender),
      courses: new FormControl(instructorRawValue.courses ?? []),
    });
  }

  getInstructor(form: InstructorFormGroup): IInstructor | NewInstructor {
    return this.convertInstructorRawValueToInstructor(form.getRawValue() as InstructorFormRawValue | NewInstructorFormRawValue);
  }

  resetForm(form: InstructorFormGroup, instructor: InstructorFormGroupInput): void {
    const instructorRawValue = this.convertInstructorToInstructorRawValue({ ...this.getFormDefaults(), ...instructor });
    form.reset(
      {
        ...instructorRawValue,
        id: { value: instructorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InstructorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      hireDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      courses: [],
    };
  }

  private convertInstructorRawValueToInstructor(
    rawInstructor: InstructorFormRawValue | NewInstructorFormRawValue,
  ): IInstructor | NewInstructor {
    return {
      ...rawInstructor,
      hireDate: dayjs(rawInstructor.hireDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawInstructor.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawInstructor.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInstructorToInstructorRawValue(
    instructor: IInstructor | (Partial<NewInstructor> & InstructorFormDefaults),
  ): InstructorFormRawValue | PartialWithRequiredKeyOf<NewInstructorFormRawValue> {
    return {
      ...instructor,
      hireDate: instructor.hireDate ? instructor.hireDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: instructor.createdDate ? instructor.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: instructor.lastModifiedDate ? instructor.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      courses: instructor.courses ?? [],
    };
  }
}
