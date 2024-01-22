import {Component, OnInit} from '@angular/core';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import {JsonPipe, KeyValuePipe} from '@angular/common';

import SharedModule from "../../../shared/shared.module";
import {ICurriculumMap} from "../../../entities/curriculum-map/curriculum-map.model";
import {ICourse} from "../../../entities/course/course.model";
import {CourseService} from "../../../entities/course/service/course.service";
import {CurriculumMapService} from "../../../entities/curriculum-map/service/curriculum-map.service";

// @ts-ignore

@Component({
  selector: 'jhi-curriculum-mapping-dashboard',
  standalone: true,
  imports: [SharedModule, NgbTypeaheadModule, FormsModule, JsonPipe, KeyValuePipe],
  templateUrl: './curriculum-mapping-dashboard.component.html',
  styleUrl: './curriculum-mapping-dashboard.component.scss'
})
export class CurriculumMappingDashboardComponent implements OnInit{
  constructor(protected courseService: CourseService,
              protected curriculumMapService: CurriculumMapService) { }

  selectedCourse: ICourse | null = null;

  formatter = (course: ICourse) => course ?
    ((course?.subject ?? '') + ': ' +
    (course?.gradelevel?.description ?? '')  + ' ' +
    (course?.schYr?.description ?? '')) : '';

  courses?: ICourse[] | null = [];
  groupedByQuarter: Map<number, ICurriculumMap[]> = new Map<number, ICurriculumMap[]>();

  isLoading = false;

  ngOnInit(): void {
    this.courseService.query().subscribe(er => this.courses = er.body);
  }

  search: OperatorFunction<string, readonly ICourse[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) => (this.courses? this.courses : []).
      filter((course) => new RegExp(term, 'mi')
        .test((course?.subject ?? '') + ': ' +
          (course?.gradelevel?.description ?? '')  + ' ' +
          (course?.schYr?.description ?? ''))).slice(0, 10)),
    );


  loadCurriculumMappings(course: ICourse | null) {
    console.log('loadCurriculumMappings=>', course);
    if(course) {
      this.curriculumMapService.queryByCourse(course.id).subscribe(er => {
        let curriculumMaps = er.body ?? [];
        curriculumMaps?.sort((a, b) => (a?.quarterNo??0) - (b?.quarterNo??0) || (a?.weekNo??0) - (b.weekNo??0));
        this.groupedByQuarter = this.toQuarterGrouping(curriculumMaps);
        console.log('loadCurriculumMappings groupedByQuarter=>', this.groupedByQuarter);
      });
    }
  }

  toHtml(str: string): string{
    str = str.split('\n').join("<br/>");
    str = str.replace(/\s\s\s/g, '&emsp;');
    return str;
  }

  toQuarterGrouping(array: ICurriculumMap[] | []): Map<number, ICurriculumMap[]>{
    const hash = (array??[]).reduce((map: Map<number, ICurriculumMap[]>, item: ICurriculumMap) =>  {
      const key = item?.quarterNo ?? 0;

      let list = map.get(key);
      if(!list) {
        list = [];
        map.set(key, list);
      }
      list.push(item);
      return map;
    }, new Map<number, ICurriculumMap[]>());

    console.log(`toQuarterGrouping reduced:`, hash)

    return hash;
  }
}
