import { Component, OnInit } from '@angular/core';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe, KeyValuePipe } from '@angular/common';

import { ICurriculumMap } from '../../../entities/curriculum-map/curriculum-map.model';
import { ICourse } from '../../../entities/course/course.model';
import { CourseService } from '../../../entities/course/service/course.service';
import {
  CurriculumMapService,
  EntityArrayResponseType as CurriculumMapEntityArrayResponseType,
} from '../../../entities/curriculum-map/service/curriculum-map.service';
import {
  EntityArrayResponseType as LearningCompetencyEntityArrayResponseType,
  LearningCompetencyService,
} from '../../../entities/learning-competency/service/learning-competency.service';
import { ILearningCompetency } from '../../../entities/learning-competency/learning-competency.model';
import {
  StrategiesService,
  EntityArrayResponseType as StrategiesEntityArrayResponseType,
} from '../../../entities/strategies/service/strategies.service';
import { IStrategies } from '../../../entities/strategies/strategies.model';
import { IAssessment } from '../../../entities/assessment/assessment.model';
import {
  AssessmentService,
  EntityArrayResponseType as AssessmentEntityArrayResponseType,
} from '../../../entities/assessment/service/assessment.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseDetailCardComponent } from '../course-detail-card/course-detail-card.component';
import { ScopeSeqCardComponent } from '../scope-seq-card/scope-seq-card.component';
import { QuarterCardComponent } from '../quarter-card/quarter-card.component';
import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-curriculum-mapping-dashboard',
  imports: [
    NgbTypeaheadModule,
    FormsModule,
    JsonPipe,
    KeyValuePipe,
    RouterLink,
    CourseDetailCardComponent,
    ScopeSeqCardComponent,
    QuarterCardComponent,
    FontAwesomeModule,
    Alert,
    AlertError,
  ],
  templateUrl: './curriculum-mapping-dashboard.component.html',
})
export class CurriculumMappingDashboardComponent implements OnInit {
  selectedCourse: ICourse | null = null;
  selectedQuarter: number = 1;

  courses?: ICourse[] | null = [];

  hasCurMap = false;
  curMapByQuarter: Map<number, ICurriculumMap[]> = new Map();
  lcMap: Map<number, ILearningCompetency[]> = new Map();
  sMap: Map<number, IStrategies[]> = new Map();
  aMap: Map<number, IAssessment[]> = new Map();

  isLoading = false;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected courseService: CourseService,
    protected curriculumMapService: CurriculumMapService,
    protected learningCompetencyService: LearningCompetencyService,
    protected strategiesService: StrategiesService,
    protected assessmentService: AssessmentService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      if (course) {
        this.isLoading = true;
        this.selectedCourse = course;
        this.clear();
        forkJoin([
          this.curriculumMapService.queryByCourse(course.id),
          this.learningCompetencyService.queryByCourse(course.id),
          this.strategiesService.queryByCourse(course.id),
          this.assessmentService.queryByCourse(course.id),
        ]).subscribe(res => this.loadCurriculumMappingsResponse(res));
      }
    });

    this.courseService.query().subscribe(er => (this.courses = er.body));
  }

  formatter = (course: ICourse): string =>
    (course.subject ?? '') + ': ' + (course.gradelevel?.description ?? '') + ' ' + (course.courseDescription ?? '');

  search: OperatorFunction<string, readonly ICourse[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      map(term =>
        (this.courses ? this.courses : [])
          .filter(course =>
            new RegExp(term, 'mi').test(
              (course.subject ?? '') + ': ' + (course.gradelevel?.description ?? '') + ' ' + (course.courseDescription ?? ''),
            ),
          )
          .slice(0, 10),
      ),
    );

  loadCurriculumMappings(course: ICourse | null): void {
    if (course) {
      this.router.navigate(['/', 'curriculum-mapping', 'dashboard', course.id, this.selectedQuarter]);
    }
  }

  loadCurriculumMappingsResponse(
    res: [
      CurriculumMapEntityArrayResponseType,
      LearningCompetencyEntityArrayResponseType,
      StrategiesEntityArrayResponseType,
      AssessmentEntityArrayResponseType,
    ],
  ): void {
    const [currRes, lcRes, sRes, aRes] = res;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (res && res.length > 1) {
      this.lcMap = this.mapLearningCompetenceyByCurriculum(lcRes.body ?? []);
      this.sMap = this.mapStrategiesByLearningCompetency(sRes.body ?? []);
      this.aMap = this.mapAssessmentByLearningCompetency(aRes.body ?? []);
      this.curMapByQuarter = this.mapCurriculumByQuarter(currRes.body ?? []);

      this.activatedRoute.params.subscribe(({ quarterNo }) => {
        this.selectedQuarter = +quarterNo;
        this.isLoading = false;
      });
    }
  }
  clear() {
    this.lcMap = new Map();
    this.sMap = new Map();
    this.aMap = new Map();
    this.curMapByQuarter = new Map();
  }

  mapCurriculumByQuarter(array: ICurriculumMap[] = []): Map<number, ICurriculumMap[]> {
    this.hasCurMap = array.length > 0;
    array.sort((a, b) => (a.quarterNo ?? 0) - (b.quarterNo ?? 0) || (a.weekNo ?? 0) - (b.weekNo ?? 0));
    const hash = array.reduce((mapper: Map<number, ICurriculumMap[]>, item: ICurriculumMap) => {
      const key = item.quarterNo ?? 0;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<number, ICurriculumMap[]>());
    return hash;
  }

  mapLearningCompetenceyByCurriculum(array: ILearningCompetency[]): Map<number, ICurriculumMap[]> {
    const hash = array.reduce((mapper: Map<number, ILearningCompetency[]>, item: ILearningCompetency) => {
      const key = item.curriculumMap?.id ?? 0;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<number, ILearningCompetency[]>());
    return hash;
  }

  mapStrategiesByLearningCompetency(array: IStrategies[]): Map<number, IStrategies[]> {
    const hash = array.reduce((mapper: Map<number, IStrategies[]>, item: IStrategies) => {
      const key = item.learningCompetency?.id ?? 0;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<number, IStrategies[]>());
    return hash;
  }

  mapAssessmentByLearningCompetency(array: IAssessment[]): Map<number, IAssessment[]> {
    const hash = array.reduce((mapper: Map<number, IAssessment[]>, item: IAssessment) => {
      const key = item.learningCompetency?.id ?? 0;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<number, IAssessment[]>());
    return hash;
  }
}
