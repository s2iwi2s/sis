/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { StudentFilterFormGroup, StudentFormService } from 'app/entities/student/update/student-form.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { IStudent, IStudentFilter } from 'app/entities/student/student.model';
import { ReactiveFormsModule } from '@angular/forms';
import { IAppConfig } from '../../../entities/app-config/app-config.model';
import { map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../../../entities/app-config/service/app-config.service';
import { TranslateDirective } from '../../../shared/language';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-search-card',
  imports: [FaIconComponent, RouterLink, ReactiveFormsModule, TranslateDirective, TranslateModule],
  templateUrl: './search-card.html',
  styleUrl: './search-card.scss',
})
export class SearchCard implements OnInit {
  readonly setSelectedStudent = output<IStudent>();
  readonly studentOutputFilter = output<IStudentFilter>();

  readonly source = 'enroll';

  protected studentFormService = inject(StudentFormService);
  protected appConfigService = inject(AppConfigService);

  gradelevelsCollection = signal<IAppConfig[]>([]);

  ngOnInit(): void {
    this.loadRelationshipsOptions();
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ code: 'GRADE_LEVEL' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(map(this.appConfigService.sortAppConfig))
      // .pipe(
      //   map((appConfigs: IAppConfig[]) =>
      //     this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.student?.gradelevel),
      //   ),
      // )
      .subscribe((appConfigs: IAppConfig[]) => this.gradelevelsCollection.set(appConfigs));
  }

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
