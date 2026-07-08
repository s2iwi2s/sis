/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StudentFormGroup, StudentFormService } from 'app/entities/student/update/student-form.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Student } from 'app/entities/student/list/student';
import { RouterLink } from '@angular/router';
import { IStudent, NewStudent } from 'app/entities/student/student.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-search-card',
  imports: [FaIconComponent, Student, RouterLink, ReactiveFormsModule],
  templateUrl: './search-card.html',
  styleUrl: './search-card.scss',
})
export class SearchCard {
  readonly source = 'enroll';
  studentFilter: IStudent | NewStudent = {} as IStudent | NewStudent;

  protected studentFormService = inject(StudentFormService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  filterForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  searchLearner(): void {
    console.log('SearchCard.searchLearner() called with filterForm value:', this.filterForm.value);
    const filter = this.studentFormService.getStudent(this.filterForm);
    console.log('SearchCardsearchLearner() called with filter:', filter);
    this.studentFilter = filter;
  }
}
