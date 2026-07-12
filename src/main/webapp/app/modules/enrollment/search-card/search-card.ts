/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { StudentFilterFormGroup, StudentFormService } from 'app/entities/student/update/student-form.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { IStudent, IStudentFilter } from 'app/entities/student/student.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-search-card',
  imports: [FaIconComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './search-card.html',
  styleUrl: './search-card.scss',
})
export class SearchCard {
  readonly setSelectedStudent = output<IStudent>();
  readonly studentOutputFilter = output<IStudentFilter>();

  readonly source = 'enroll';

  protected studentFormService = inject(StudentFormService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  filterForm: StudentFilterFormGroup = this.studentFormService.createStudentFilterForm();

  searchLearner(): void {
    const filter = this.filterForm.value as IStudentFilter;
    this.studentOutputFilter.emit(filter);
  }

  selectStudent(selected: IStudent): void {
    this.setSelectedStudent.emit(selected);
  }
}
