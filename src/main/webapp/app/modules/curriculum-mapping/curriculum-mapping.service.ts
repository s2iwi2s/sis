import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IReport, NewReport } from './report.model';
import { ICourse } from '../../entities/course/course.model';
import { ICurriculumMap } from '../../entities/curriculum-map/curriculum-map.model';
import { ILearningCompetency } from '../../entities/learning-competency/learning-competency.model';
import { IStrategies } from '../../entities/strategies/strategies.model';
import { IAssessment } from '../../entities/assessment/assessment.model';
import {
  CurriculumMapService,
  EntityArrayResponseType as CurriculumMapEntityArrayResponseType,
} from '../../entities/curriculum-map/service/curriculum-map.service';
import {
  EntityArrayResponseType as LearningCompetencyEntityArrayResponseType,
  LearningCompetencyService,
} from '../../entities/learning-competency/service/learning-competency.service';
import {
  EntityArrayResponseType as StrategiesEntityArrayResponseType,
  StrategiesService,
} from '../../entities/strategies/service/strategies.service';
import {
  AssessmentService,
  EntityArrayResponseType as AssessmentEntityArrayResponseType,
} from '../../entities/assessment/service/assessment.service';
import { CourseService } from '../../entities/course/service/course.service';

type RestOf<T extends IReport | NewReport> = Omit<T, ''> & {};
@Injectable({ providedIn: 'root' })
export class CurriculumMappingService {
  hasCurMap = false;
  curMapByQuarter = new Map<string, ICurriculumMap[]>();
  lcMap = new Map<string, ILearningCompetency[]>();
  sMap = new Map<string, IStrategies[]>();
  aMap = new Map<string, IAssessment[]>();
  selectedQuarter = signal<number>(1);

  isLoading = signal(false);

  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/report');

  protected curriculumMapService = inject(CurriculumMapService);
  protected learningCompetencyService = inject(LearningCompetencyService);
  protected strategiesService = inject(StrategiesService);
  protected assessmentService = inject(AssessmentService);
  protected courseService = inject(CourseService);

  private _courses: ICourse[] = [];
  private _selectedCourse: ICourse = {} as ICourse;

  get courses(): ICourse[] {
    return this._courses;
  }
  set courses(value: ICourse[]) {
    this._courses = value;
  }
  get selectedCourse(): ICourse {
    return this._selectedCourse;
  }
  set selectedCourse(value: ICourse) {
    this._selectedCourse = value;
  }

  loadCourses(): void {
    this.courseService.query().subscribe(res => (this.courses = res.body ?? []));
  }

  find(courseId: number): Observable<IReport> {
    return this.http.get<IReport>(`${this.resourceUrl}/currMap/${courseId}`, { observe: 'response' }).pipe(map(res => res.body!));
  }

  formatter = (course: ICourse): string => {
    if (course.id && course.id !== -1) {
      return `${course.subject ? course.subject + ': ' : ''}: ${course.gradelevel?.description ?? ''} ${course.year?.name ?? ''} ${course.terms?.name ?? ''}`;
      // (
      //   (course.subject ? course.subject + ': ' : '') +
      //   (course.gradelevel?.description ?? '') +
      //   (course.year?.name ?? '') +
      //   ' ' +
      //   (course.terms?.name ?? '');
    }
    return '';
  };

  search: OperatorFunction<string, readonly ICourse[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      map(term =>
        this.courses
          .filter(course =>
            new RegExp(term, 'mi').test(
              (course.subject ? course.subject + ': ' : '') +
                (course.gradelevel?.description ?? '') +
                ' ' +
                (course.year?.name ?? '') +
                ' ' +
                (course.terms?.name ?? ''),
            ),
          )
          .slice(0, 10),
      ),
    );

  clear(): void {
    this.lcMap = new Map();
    this.sMap = new Map();
    this.aMap = new Map();
    this.curMapByQuarter = new Map();
  }

  loadCurriculumMappings(course: ICourse | null): void {
    if (course) {
      this.isLoading.set(true);
      this._selectedCourse = course;
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

      // FIXME set quarterNo
      // this.activatedRoute.params.subscribe(({ quarterNo }) => {
      //   this.selectedQuarter.set(quarterNo);
      // });
      this.isLoading.set(false);
    }
  }

  setSelectedQuarter(quarter: any) {
    this.selectedQuarter.set(quarter);
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
