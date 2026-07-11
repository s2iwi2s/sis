import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs/esm';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(birthDate: dayjs.Dayjs | null | undefined): number {
    if (birthDate === null || birthDate === undefined || !birthDate?.isValid()) {
      return 0;
    }

    return dayjs().diff(birthDate, 'year');
  }
}
