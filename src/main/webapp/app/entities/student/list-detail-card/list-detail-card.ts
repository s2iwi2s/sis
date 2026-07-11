import { Component, inject, input, output } from '@angular/core';
import { IStudent } from '../student.model';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from '../../../shared/date';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { NamePipe } from '../../../shared/name/name-pipe';

@Component({
  selector: 'jhi-list-detail-card',
  imports: [FormatMediumDatePipe, FormatMediumDatetimePipe, NamePipe],
  templateUrl: './list-detail-card.html',
  styleUrl: './list-detail-card.scss',
})
export class ListDetailCard {
  readonly setSelectedStudent = output<IStudent>();
  readonly student = input<IStudent | null>({} as IStudent);
  readonly selectedStudentId = input<number>(-1);

  protected applicationConfigService = inject(ApplicationConfigService);

  isActive(): boolean {
    return this.student()?.id === this.selectedStudentId();
  }

  selectStudent(selected: IStudent): void {
    console.log('ListDetailCard.selectStudent() called with student:', JSON.stringify(selected));
    this.setSelectedStudent.emit(selected);
  }
}
