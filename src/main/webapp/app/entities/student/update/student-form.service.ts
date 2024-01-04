import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStudent, NewStudent } from '../student.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudent for edit and NewStudentFormGroupInput for create.
 */
type StudentFormGroupInput = IStudent | PartialWithRequiredKeyOf<NewStudent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStudent | NewStudent> = Omit<T, 'birthDate'> & {
  birthDate?: string | null;
};

type StudentFormRawValue = FormValueOf<IStudent>;

type NewStudentFormRawValue = FormValueOf<NewStudent>;

type StudentFormDefaults = Pick<NewStudent, 'id' | 'birthDate'>;

type StudentFormGroupContent = {
  id: FormControl<StudentFormRawValue['id'] | NewStudent['id']>;
  lrn: FormControl<StudentFormRawValue['lrn']>;
  firstName: FormControl<StudentFormRawValue['firstName']>;
  middleName: FormControl<StudentFormRawValue['middleName']>;
  lastName: FormControl<StudentFormRawValue['lastName']>;
  extName: FormControl<StudentFormRawValue['extName']>;
  birthDate: FormControl<StudentFormRawValue['birthDate']>;
  birthPlace: FormControl<StudentFormRawValue['birthPlace']>;
  contactNo: FormControl<StudentFormRawValue['contactNo']>;
  address1: FormControl<StudentFormRawValue['address1']>;
  address2: FormControl<StudentFormRawValue['address2']>;
  city: FormControl<StudentFormRawValue['city']>;
  zipCode: FormControl<StudentFormRawValue['zipCode']>;
  country: FormControl<StudentFormRawValue['country']>;
  nationality: FormControl<StudentFormRawValue['nationality']>;
  motherTongue: FormControl<StudentFormRawValue['motherTongue']>;
  religion: FormControl<StudentFormRawValue['religion']>;
  fathersLastName: FormControl<StudentFormRawValue['fathersLastName']>;
  fathersMiddleName: FormControl<StudentFormRawValue['fathersMiddleName']>;
  fathersFirstName: FormControl<StudentFormRawValue['fathersFirstName']>;
  fathersExtName: FormControl<StudentFormRawValue['fathersExtName']>;
  fathersOccupation: FormControl<StudentFormRawValue['fathersOccupation']>;
  fathersContacts: FormControl<StudentFormRawValue['fathersContacts']>;
  mothersLastName: FormControl<StudentFormRawValue['mothersLastName']>;
  mothersMiddleName: FormControl<StudentFormRawValue['mothersMiddleName']>;
  mothersFirstName: FormControl<StudentFormRawValue['mothersFirstName']>;
  mothersOccupation: FormControl<StudentFormRawValue['mothersOccupation']>;
  mothersContacts: FormControl<StudentFormRawValue['mothersContacts']>;
  guardianFullName: FormControl<StudentFormRawValue['guardianFullName']>;
  guardianContacts: FormControl<StudentFormRawValue['guardianContacts']>;
  gender: FormControl<StudentFormRawValue['gender']>;
};

export type StudentFormGroup = FormGroup<StudentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentFormService {
  createStudentFormGroup(student: StudentFormGroupInput = { id: null }): StudentFormGroup {
    const studentRawValue = this.convertStudentToStudentRawValue({
      ...this.getFormDefaults(),
      ...student,
    });
    return new FormGroup<StudentFormGroupContent>({
      id: new FormControl(
        { value: studentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      lrn: new FormControl(studentRawValue.lrn),
      firstName: new FormControl(studentRawValue.firstName, {
        validators: [Validators.maxLength(50)],
      }),
      middleName: new FormControl(studentRawValue.middleName, {
        validators: [Validators.maxLength(50)],
      }),
      lastName: new FormControl(studentRawValue.lastName, {
        validators: [Validators.maxLength(50)],
      }),
      extName: new FormControl(studentRawValue.extName, {
        validators: [Validators.maxLength(10)],
      }),
      birthDate: new FormControl(studentRawValue.birthDate),
      birthPlace: new FormControl(studentRawValue.birthPlace, {
        validators: [Validators.maxLength(50)],
      }),
      contactNo: new FormControl(studentRawValue.contactNo, {
        validators: [Validators.maxLength(12)],
      }),
      address1: new FormControl(studentRawValue.address1, {
        validators: [Validators.maxLength(200)],
      }),
      address2: new FormControl(studentRawValue.address2, {
        validators: [Validators.maxLength(200)],
      }),
      city: new FormControl(studentRawValue.city, {
        validators: [Validators.maxLength(50)],
      }),
      zipCode: new FormControl(studentRawValue.zipCode, {
        validators: [Validators.maxLength(10)],
      }),
      country: new FormControl(studentRawValue.country, {
        validators: [Validators.maxLength(50)],
      }),
      nationality: new FormControl(studentRawValue.nationality, {
        validators: [Validators.maxLength(100)],
      }),
      motherTongue: new FormControl(studentRawValue.motherTongue, {
        validators: [Validators.maxLength(50)],
      }),
      religion: new FormControl(studentRawValue.religion, {
        validators: [Validators.maxLength(100)],
      }),
      fathersLastName: new FormControl(studentRawValue.fathersLastName, {
        validators: [Validators.maxLength(50)],
      }),
      fathersMiddleName: new FormControl(studentRawValue.fathersMiddleName, {
        validators: [Validators.maxLength(50)],
      }),
      fathersFirstName: new FormControl(studentRawValue.fathersFirstName, {
        validators: [Validators.maxLength(50)],
      }),
      fathersExtName: new FormControl(studentRawValue.fathersExtName, {
        validators: [Validators.maxLength(50)],
      }),
      fathersOccupation: new FormControl(studentRawValue.fathersOccupation, {
        validators: [Validators.maxLength(50)],
      }),
      fathersContacts: new FormControl(studentRawValue.fathersContacts, {
        validators: [Validators.maxLength(50)],
      }),
      mothersLastName: new FormControl(studentRawValue.mothersLastName, {
        validators: [Validators.maxLength(50)],
      }),
      mothersMiddleName: new FormControl(studentRawValue.mothersMiddleName, {
        validators: [Validators.maxLength(50)],
      }),
      mothersFirstName: new FormControl(studentRawValue.mothersFirstName, {
        validators: [Validators.maxLength(50)],
      }),
      mothersOccupation: new FormControl(studentRawValue.mothersOccupation, {
        validators: [Validators.maxLength(50)],
      }),
      mothersContacts: new FormControl(studentRawValue.mothersContacts, {
        validators: [Validators.maxLength(50)],
      }),
      guardianFullName: new FormControl(studentRawValue.guardianFullName, {
        validators: [Validators.maxLength(50)],
      }),
      guardianContacts: new FormControl(studentRawValue.guardianContacts, {
        validators: [Validators.maxLength(50)],
      }),
      gender: new FormControl(studentRawValue.gender),
    });
  }

  getStudent(form: StudentFormGroup): IStudent | NewStudent {
    return this.convertStudentRawValueToStudent(form.getRawValue() as StudentFormRawValue | NewStudentFormRawValue);
  }

  resetForm(form: StudentFormGroup, student: StudentFormGroupInput): void {
    const studentRawValue = this.convertStudentToStudentRawValue({ ...this.getFormDefaults(), ...student });
    form.reset(
      {
        ...studentRawValue,
        id: { value: studentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StudentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      birthDate: currentTime,
    };
  }

  private convertStudentRawValueToStudent(rawStudent: StudentFormRawValue | NewStudentFormRawValue): IStudent | NewStudent {
    return {
      ...rawStudent,
      birthDate: dayjs(rawStudent.birthDate, DATE_TIME_FORMAT),
    };
  }

  private convertStudentToStudentRawValue(
    student: IStudent | (Partial<NewStudent> & StudentFormDefaults),
  ): StudentFormRawValue | PartialWithRequiredKeyOf<NewStudentFormRawValue> {
    return {
      ...student,
      birthDate: student.birthDate ? student.birthDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
