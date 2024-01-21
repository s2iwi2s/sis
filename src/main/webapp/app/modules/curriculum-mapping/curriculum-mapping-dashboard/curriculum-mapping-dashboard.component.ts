import {Component, OnInit} from '@angular/core';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import SharedModule from "../../../shared/shared.module";
import {ICurriculumMap} from "../../../entities/curriculum-map/curriculum-map.model";
import {ICourse} from "../../../entities/course/course.model";
import {CourseService} from "../../../entities/course/service/course.service";
import {CurriculumMapService} from "../../../entities/curriculum-map/service/curriculum-map.service";

@Component({
  selector: 'jhi-curriculum-mapping-dashboard',
  standalone: true,
  imports: [SharedModule, NgbTypeaheadModule, FormsModule, JsonPipe],
  templateUrl: './curriculum-mapping-dashboard.component.html',
  styleUrl: './curriculum-mapping-dashboard.component.scss'
})
export class CurriculumMappingDashboardComponent implements OnInit{
  constructor(protected courseService: CourseService,
              protected curriculumMapService: CurriculumMapService) { }

  selectedCourse: ICourse = {
    id: 0,
    subject: '',
    gradelevel: {id:0, description:''},
    schYr: {id:0, description:''},
  };
  formatter = (course: ICourse) =>
    (course?.subject ?? '') + ': ' +
    (course?.gradelevel?.description ?? '')  + ' ' +
    (course?.schYr?.description ?? '');

  courses?: ICourse[] | null = [];
  curriculumMaps?: ICurriculumMap[] | null;
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


  loadCurriculumMappings(course: ICourse) {
    console.log('loadCurriculumMappings=>', course);
    this.curriculumMapService.queryByCourse(course.id).subscribe(er => {
      this.curriculumMaps = er.body;

      console.log('loadCurriculumMappings curriculumMaps=>', this.curriculumMaps);
    })
  }
}
