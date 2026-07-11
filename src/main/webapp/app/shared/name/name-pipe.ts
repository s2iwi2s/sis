import { Pipe, PipeTransform } from '@angular/core';
import { IStudent } from '../../entities/student/student.model';

@Pipe({
  name: 'name',
})
export class NamePipe implements PipeTransform {
  transform(value: IStudent): unknown {
    return `${value.lastName}, ${value.firstName} ${value.middleName}`;
  }
}
