/* eslint-disable no-console */
import { Component, inject } from '@angular/core';
import { StudentFormGroup, StudentFormService } from 'app/entities/student/update/student-form.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Student } from 'app/entities/student/list/student';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'jhi-search-card',
  imports: [FaIconComponent, Student, RouterLink],
  templateUrl: './search-card.html',
  styleUrl: './search-card.scss',
})
export class SearchCard {
  readonly source = 'enroll';
  protected studentFormService = inject(StudentFormService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  filterForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  searchLearner(): void {
    console.log('searchLearner() called');
  }
}
