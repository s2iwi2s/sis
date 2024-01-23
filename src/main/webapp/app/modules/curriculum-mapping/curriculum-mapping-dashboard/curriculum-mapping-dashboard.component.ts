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
              protected learningCompetencyService: LearningCompetencyService) {
  }

  selectedCourse: ICourse | null = null;

  formatter = (course: ICourse) => course ?
    ((course?.subject ?? '') + ': ' +
      (course?.gradelevel?.description ?? '') + ' ' +
      (course?.schYr?.description ?? '')) : '';

  courses?: ICourse[] | null = [];
  curMapByQuarter: Map<number, ICurriculumMap[]> = new Map();
  lcMap: Map<number, ILearningCompetency[]> = new Map();

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

  toHtml(str: string): string {
    str = str.split('\n').join("<br/>");
    str = str.replace(/\s\s\s/g, '&emsp;');
    return str;
  }

  loadCurriculumMappings(course: ICourse | null) {
    if (course) {
      forkJoin([this.curriculumMapService.queryByCourse(course.id),
        this.learningCompetencyService.queryByCourse(course.id)]).subscribe(res => this.loadCurriculumMappingsResponse(res));
    }
  }

  loadCurriculumMappingsResponse(res: [CurriculumMapEntityArrayResponseType, LearningCompetencyEntityArrayResponseType]) {
    const [currRes, lcRes] = res;
    if (res && res.length > 1) {
      this.lcMap = this.toLearningCompetencyGroupMapping(lcRes.body ?? []);
      this.curMapByQuarter = this.toQuarterGroupMapping(currRes.body ?? []);
    }
  }

  toQuarterGroupMapping(array: ICurriculumMap[]): Map<number, ICurriculumMap[]> {
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

  toLearningCompetencyGroupMapping(array: ILearningCompetency[]): Map<number, ICurriculumMap[]> {
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
  getLearningCompetencies(currMapId: number){
    return this.lcMap.get(currMapId);
  }
}
