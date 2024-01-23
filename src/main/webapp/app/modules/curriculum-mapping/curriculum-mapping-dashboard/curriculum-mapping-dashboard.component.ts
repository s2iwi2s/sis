import {Component, OnInit} from '@angular/core';

import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {forkJoin, Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {FormsModule} from '@angular/forms';
import {JsonPipe, KeyValuePipe} from '@angular/common';

import SharedModule from "../../../shared/shared.module";
import {ICurriculumMap} from "../../../entities/curriculum-map/curriculum-map.model";
import {ICourse} from "../../../entities/course/course.model";
import {CourseService} from "../../../entities/course/service/course.service";
import {
  CurriculumMapService,
  EntityArrayResponseType as CurriculumMapEntityArrayResponseType
} from "../../../entities/curriculum-map/service/curriculum-map.service";
import {
  EntityArrayResponseType as LearningCompetencyEntityArrayResponseType,
  LearningCompetencyService
} from "../../../entities/learning-competency/service/learning-competency.service";
import {ILearningCompetency} from "../../../entities/learning-competency/learning-competency.model";
import {
  StrategiesService,
  EntityArrayResponseType as StrategiesEntityArrayResponseType} from "../../../entities/strategies/service/strategies.service";
import {IStrategies} from "../../../entities/strategies/strategies.model";
import {HtmlUtilService} from "../../../core/util/html-util.service";
import {IAssessment} from "../../../entities/assessment/assessment.model";
import {AssessmentService,
  EntityArrayResponseType as AssessmentEntityArrayResponseType} from "../../../entities/assessment/service/assessment.service";

@Component({
  selector: 'jhi-curriculum-mapping-dashboard',
  standalone: true,
  imports: [SharedModule, NgbTypeaheadModule, FormsModule, JsonPipe, KeyValuePipe],
  templateUrl: './curriculum-mapping-dashboard.component.html',
  styleUrl: './curriculum-mapping-dashboard.component.scss'
})
export class CurriculumMappingDashboardComponent implements OnInit {
  constructor(protected courseService: CourseService,
              protected curriculumMapService: CurriculumMapService,
              protected learningCompetencyService: LearningCompetencyService,
              protected strategiesService: StrategiesService,
              protected assessmentService: AssessmentService,
              protected htmlUtilService: HtmlUtilService) {
  }

  selectedCourse: ICourse | null = null;

  formatter = (course: ICourse) => course ?
    ((course?.subject ?? '') + ': ' +
      (course?.gradelevel?.description ?? '') + ' ' +
      (course?.schYr?.description ?? '')) : '';

  courses?: ICourse[] | null = [];

  hasCurMap = false;
  curMapByQuarter: Map<number, ICurriculumMap[]> = new Map();
  lcMap: Map<number, ILearningCompetency[]> = new Map();
  sMap: Map<number, IStrategies[]> = new Map();
  aMap: Map<number, IAssessment[]> = new Map();

  isLoading = false;

  ngOnInit(): void {
    this.courseService.query().subscribe(er => this.courses = er.body);
  }

  search: OperatorFunction<string, readonly ICourse[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) => (this.courses ? this.courses : []).filter((course) => new RegExp(term, 'mi')
        .test((course?.subject ?? '') + ': ' +
          (course?.gradelevel?.description ?? '') + ' ' +
          (course?.schYr?.description ?? ''))).slice(0, 10)),
    );

  loadCurriculumMappings(course: ICourse | null) {
    if (course) {
      forkJoin([this.curriculumMapService.queryByCourse(course.id),
          this.learningCompetencyService.queryByCourse(course.id),
          this.strategiesService.queryByCourse(course.id),
          this.assessmentService.queryByCourse(course.id)])
        .subscribe(res => this.loadCurriculumMappingsResponse(res));
    }
  }

  loadCurriculumMappingsResponse(res: [CurriculumMapEntityArrayResponseType, LearningCompetencyEntityArrayResponseType,
    StrategiesEntityArrayResponseType, AssessmentEntityArrayResponseType]) {
    const [currRes, lcRes, sRes, aRes] = res;
    if (res && res.length > 1) {
      this.lcMap = this.mapLearningCompetenceyByCurriculum(lcRes.body ?? []);
      this.sMap = this.mapStrategiesByLearningCompetency(sRes.body ?? []);
      this.aMap = this.mapAssessmentByLearningCompetency(aRes.body ?? [])
      this.curMapByQuarter = this.mapCurriculumByQuarter(currRes.body ?? []);

    }
  }

  mapCurriculumByQuarter(array: ICurriculumMap[]): Map<number, ICurriculumMap[]> {
    this.hasCurMap = array.length > 0;
    array?.sort((a, b) => (a?.quarterNo ?? 0) - (b?.quarterNo ?? 0) || (a?.weekNo ?? 0) - (b.weekNo ?? 0));
    const hash = (array ?? []).reduce((map: Map<number, ICurriculumMap[]>, item: ICurriculumMap) => {
      const key = item?.quarterNo ?? 0;
      let list = map.get(key);
      if (!list) {
        list = [];
        map.set(key, list);
      }
      list.push(item);
      return map;
    }, new Map<number, ICurriculumMap[]>());
    return hash;
  }

  mapLearningCompetenceyByCurriculum(array: ILearningCompetency[]): Map<number, ICurriculumMap[]> {
    const hash = (array ?? []).reduce((map: Map<number, ILearningCompetency[]>, item: ILearningCompetency) => {
      const key = item?.curriculumMap?.id ?? 0;
      let list = map.get(key);
      if (!list) {
        list = [];
        map.set(key, list);
      }
      list.push(item);
      return map;
    }, new Map<number, ILearningCompetency[]>());
    return hash;
  }

  getLearningCompetenciesFromMapping(currMapId: number){
    return this.lcMap.get(currMapId);
  }

  mapStrategiesByLearningCompetency(array: IStrategies[]): Map<number, IStrategies[]> {
    const hash = (array ?? []).reduce((map: Map<number, IStrategies[]>, item: IStrategies) => {
      const key = item?.learningCompetency?.id ?? 0;
      let list = map.get(key);
      if (!list) {
        list = [];
        map.set(key, list);
      }
      list.push(item);
      return map;
    }, new Map<number, IStrategies[]>());
    return hash;
  }

  getStrategiesFromMapping(learningCompetencyId: number) {
    return this.sMap.get(learningCompetencyId) ;
  }

  mapAssessmentByLearningCompetency(array: IAssessment[]): Map<number, IAssessment[]> {
    const hash = (array ?? []).reduce((map: Map<number, IAssessment[]>, item: IAssessment) => {
      const key = item?.learningCompetency?.id ?? 0;
      let list = map.get(key);
      if (!list) {
        list = [];
        map.set(key, list);
      }
      list.push(item);
      return map;
    }, new Map<number, IAssessment[]>());
    return hash;
  }

  getAssessmentFromMapping(learningCompetencyId: number) {
    return this.aMap.get(learningCompetencyId) ;
  }
}
