/* eslint-disable no-console */

import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { ICurriculumMap } from '../curriculum-map.model';
import { CurriculumMapService } from '../service/curriculum-map.service';
import { CourseService } from '../../course/service/course.service';

const curriculumMapResolve = (route: ActivatedRouteSnapshot): Observable<null | ICurriculumMap> => {
  const { id, courseId, quarterNo } = route.params;

  if (id) {
    const router = inject(Router);
    const service = inject(CurriculumMapService);
    const courseService = inject(CourseService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  } else if (courseId && quarterNo) {
    return of({ id: -1, course: { id: courseId }, quarterNo } as ICurriculumMap);
  }

  return of(null);
};

export default curriculumMapResolve;
