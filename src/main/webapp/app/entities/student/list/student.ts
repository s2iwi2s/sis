/* eslint-disable no-console */
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, filter, map, Subject, Subscription, tap } from 'rxjs';

import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { ItemCount } from 'app/shared/pagination';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { StudentDeleteDialog } from '../delete/student-delete-dialog';
import { StudentService } from '../service/student.service';
import { IStudent, IStudentFilter } from '../student.model';
import { StudentFilterFormGroup, StudentFormService } from '../update/student-form.service';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from '../../../config/input.constants';
import { ListDetailCard } from '../list-detail-card/list-detail-card';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IAppConfig } from '../../app-config/app-config.model';
import { AppConfigService } from '../../app-config/service/app-config.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-student',
  templateUrl: './student.html',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FontAwesomeModule,
    AlertError,
    Alert,
    SortDirective,
    SortByDirective,
    TranslateDirective,
    TranslateModule,
    FormatMediumDatePipe,
    FormatMediumDatetimePipe,
    NgbPagination,
    ItemCount,
    ListDetailCard,
  ],
})
export class Student implements OnInit, OnChanges {
  // selectedStudent: IStudent | null = null;
  selectedStudentId = -1;

  //readonly selectedStudent = input<number>();
  readonly source = input<string>();
  readonly studentInputFilter = input<IStudentFilter>();
  readonly setEnrollmentSelectedStudent = output<IStudent>();

  subscription: Subscription | null = null;
  readonly students = signal<IStudent[]>([]);
  studentFilter: IStudentFilter | null = null;

  sortState = sortStateSignal({});

  readonly itemsPerPage = signal(ITEMS_PER_PAGE);
  readonly totalItems = signal(0);
  readonly page = signal(1);

  protected applicationConfigService = inject(ApplicationConfigService);
  readonly router = inject(Router);
  protected readonly studentService = inject(StudentService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly isLoading = this.studentService.studentsResource.isLoading;
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);

  protected studentFormService = inject(StudentFormService);
  protected appConfigService = inject(AppConfigService);

  filterForm: StudentFilterFormGroup = this.studentFormService.createStudentFilterForm();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  gradelevelsCollection = signal<IAppConfig[]>([]);

  constructor() {
    effect(() => {
      const headers = this.studentService.studentsResource.headers();
      if (headers) {
        this.fillComponentAttributesFromResponseHeader(headers);
      }
    });
    effect(() => {
      this.students.set(this.fillComponentAttributesFromResponseBody([...this.studentService.students()]));
    });

    this.filterForm.valueChanges.pipe(debounceTime(1000)).subscribe(query => {
      console.log('Student.constructor filterForm.valueChanges called with query:', query);
      this.studentFilter = query as IStudentFilter;
      this.load();
    });

    this.loadRelationshipsOptions();
  }

  trackId = (item: IStudent): number => this.studentService.getStudentIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        // tap(() => this.load()),
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.studentInputFilter.currentValue) {
      this.studentFilter = changes.studentInputFilter.currentValue;
      console.log('Student.ngOnChanges() called with studentFilter:', this.studentFilter);
      if (
        this.studentFilter?.lrn !== null ||
        this.studentFilter?.firstName !== null ||
        this.studentFilter?.lastName !== null ||
        this.studentFilter?.birthDate !== null ||
        this.studentFilter?.gradelevel?.id !== null
      ) {
        this.load();
      }
    }
  }

  delete(student: IStudent): void {
    const modalRef = this.modalService.open(StudentDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.student = student;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend();
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page(), event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ code: 'GRADE_LEVEL', eagerload: true })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(map(this.appConfigService.sortAppConfig))
      // .pipe(
      //   map((appConfigs: IAppConfig[]) =>
      //     this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.student?.gradelevel),
      //   ),
      // )
      .subscribe((appConfigs: IAppConfig[]) => this.gradelevelsCollection.set(appConfigs));
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page.set(+(page ?? 1));
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected fillComponentAttributesFromResponseBody(data: IStudent[]): IStudent[] {
    return data;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems.set(Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER)));
  }

  protected queryBackend(): void {
    const sortStateLength = this.sortService.buildSortParam(this.sortState()).length;
    if (sortStateLength === 0) {
      this.sortState.set({ predicate: 'lastName', order: 'asc' });
    }

    const pageToLoad: number = this.page();
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage(),
      eagerload: false,
      sort: this.sortService.buildSortParam(this.sortState()),
    };

    console.log('Student.queryBackend() called with studentFilter:', this.studentFilter);
    const query = {
      ...queryObject,
      // lrn: this.studentFilter?.lrn || null,
      // firstName: this.studentFilter?.firstName || null,
      // lastName: this.studentFilter?.lastName || null,
      // "gradelevel.id": this.studentFilter?.gradelevel?.id || null
    };
    if (this.studentFilter?.lrn) {
      query.lrn = this.studentFilter.lrn;
    }
    if (this.studentFilter?.firstName) {
      query.firstName = this.studentFilter?.firstName;
    }
    if (this.studentFilter?.lastName) {
      query.lastName = this.studentFilter?.lastName;
    }
    if (this.studentFilter?.gradelevel?.id) {
      query['gradelevel.id'] = this.studentFilter?.gradelevel?.id;
    }

    console.log('Student.queryBackend() called with birthDate:', dayjs(this.studentFilter?.birthDate, DATE_FORMAT));
    if (dayjs(this.studentFilter?.birthDate, DATE_FORMAT).isValid()) {
      query.birthDate = dayjs(this.studentFilter?.birthDate, DATE_FORMAT);
    }

    console.log('Student.queryBackend() called with queryObject:', query);
    this.studentService.studentsParams.set(query);
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage(),
      sort: this.sortService.buildSortParam(sortState),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  setSelectedStudent(selected: IStudent) {
    this.selectedStudentId = selected.id;
  }

  setEnrollmentSelectedStudentEvent(selected: IStudent) {
    this.setSelectedStudent(selected);
    this.setEnrollmentSelectedStudent.emit(selected);
    //this.load();
  }
}
