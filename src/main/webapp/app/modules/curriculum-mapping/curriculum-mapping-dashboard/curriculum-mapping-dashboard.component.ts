import { Component, inject, OnInit, signal } from '@angular/core';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

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
import { HtmlUtilService } from '../../../core/util/html-util.service';
import { IAssessment } from '../../../entities/assessment/assessment.model';
import {
  AssessmentService,
  EntityArrayResponseType as AssessmentEntityArrayResponseType,
} from '../../../entities/assessment/service/assessment.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseDetailCardComponent } from '../course-detail-card/course-detail-card.component';
import { ScopeSeqCardComponent } from '../scope-seq-card/scope-seq-card.component';
import { QuarterCardComponent } from '../quarter-card/quarter-card.component';
import { AlertError } from '../../../shared/alert/alert-error';
import { Alert } from '../../../shared/alert/alert';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-curriculum-mapping-dashboard',
  standalone: true,
  imports: [
    NgbTypeaheadModule,
    FormsModule,
    RouterLink,
    CourseDetailCardComponent,
    ScopeSeqCardComponent,
    QuarterCardComponent,
    AlertError,
    Alert,
    FontAwesomeModule,
  ],
  templateUrl: './curriculum-mapping-dashboard.component.html',
})
export class CurriculumMappingDashboardComponent implements OnInit {
  selectedCourse: ICourse | null = null;
  selectedQuarter = signal(1);

  isLoading = signal(false);

  courses?: ICourse[] | null = [];

  hasCurMap = false;
  curMapByQuarter = new Map<string, ICurriculumMap[]>();
  lcMap = new Map<string, ILearningCompetency[]>();
  sMap = new Map<string, IStrategies[]>();
  aMap = new Map<string, IAssessment[]>();

  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected courseService = inject(CourseService);
  protected curriculumMapService = inject(CurriculumMapService);
  protected learningCompetencyService = inject(LearningCompetencyService);
  protected strategiesService = inject(StrategiesService);
  protected assessmentService = inject(AssessmentService);
  protected htmlUtilService = inject(HtmlUtilService);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.loadMapping(course);
    });

    this.courseService.query().subscribe(er => (this.courses = er.body));
  }

  setSelectedQuarter(quarter: any) {
    this.selectedQuarter.set(quarter);
  }

  formatter = (course: ICourse): string =>
    (course.subject ?? '') + ': ' + (course.gradelevel?.description ?? '') + ' ' + (course.year?.name ?? '');

  search: OperatorFunction<string, readonly ICourse[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      map(term =>
        (this.courses ?? [])
          .filter(course =>
            new RegExp(term, 'mi').test(
              (course.subject ?? '') + ': ' + (course.gradelevel?.description ?? '') + ' ' + (course.year?.name ?? ''),
            ),
          )
          .slice(0, 10),
      ),
    );

  loadCurriculumMappings(): void {
    //this.router.navigate(['/', 'curriculum-mapping', 'dashboard', this.selectedCourse?.id, this.selectedQuarter()]);
    // this.load(this.selectedCourse);
    // if (course) {
    //   this.isLoading.set(true);
    //   this.selectedCourse = course;
    //   this.clear();
    //   forkJoin([
    //     this.curriculumMapService.queryByCourse(course.id),
    //     this.learningCompetencyService.queryByCourse(course.id),
    //     this.strategiesService.queryByCourse(course.id),
    //     this.assessmentService.queryByCourse(course.id),
    //   ]).subscribe(res => this.loadCurriculumMappingsResponse(res));
    // }
    if (this.selectedCourse) {
      this.loadMapping(this.selectedCourse);
    }
  }
  loadMapping(course: ICourse): void {
    if (course.id) {
      this.isLoading.set(true);
      this.selectedCourse = course;
      this.clear();
      forkJoin([
        this.curriculumMapService.queryByCourse(course.id),
        this.learningCompetencyService.queryByCourse(course.id),
        this.strategiesService.queryByCourse(course.id),
        this.assessmentService.queryByCourse(course.id),
      ]).subscribe(res => this.loadCurriculumMappingsResponse(res));
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
        this.selectedQuarter.set(quarterNo);
      });
      this.isLoading.set(false);
    }
  }
  clear(): void {
    this.lcMap = new Map();
    this.sMap = new Map();
    this.aMap = new Map();
    this.curMapByQuarter = new Map();
  }

  mapCurriculumByQuarter(array: ICurriculumMap[] = []): Map<string, ICurriculumMap[]> {
    this.hasCurMap = array.length > 0;
    array.sort((a, b) => (a.quarterNo ?? 0) - (b.quarterNo ?? 0) || (a.weekNo ?? 0) - (b.weekNo ?? 0));
    const hash = array.reduce((mapper: Map<string, ICurriculumMap[]>, item: ICurriculumMap) => {
      const key = `${item.quarterNo}`;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<string, ICurriculumMap[]>());
    return hash;
  }

  mapLearningCompetenceyByCurriculum(array: ILearningCompetency[]): Map<string, ICurriculumMap[]> {
    const hash = array.reduce((mapper: Map<string, ILearningCompetency[]>, item: ILearningCompetency) => {
      const key = `${item.curriculumMap?.id}`;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<string, ILearningCompetency[]>());
    return hash;
  }

  mapStrategiesByLearningCompetency(array: IStrategies[]): Map<string, IStrategies[]> {
    const hash = array.reduce((mapper: Map<string, IStrategies[]>, item: IStrategies) => {
      const key = `${item.learningCompetency?.id}`;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<string, IStrategies[]>());
    return hash;
  }

  mapAssessmentByLearningCompetency(array: IAssessment[]): Map<string, IAssessment[]> {
    const hash = array.reduce((mapper: Map<string, IAssessment[]>, item: IAssessment) => {
      const key = `${item.learningCompetency?.id}`;
      let list = mapper.get(key);
      if (!list) {
        list = [];
        mapper.set(key, list);
      }
      list.push(item);
      return mapper;
    }, new Map<string, IAssessment[]>());
    return hash;
  }
}
