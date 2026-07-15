import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ICurriculumMap } from '../curriculum-map.model';
import { CurriculumMapService } from '../service/curriculum-map.service';

import { CurriculumMapFormGroup, CurriculumMapFormService } from './curriculum-map-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-curriculum-map-update',
  templateUrl: './curriculum-map-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CurriculumMapUpdate implements OnInit {
  readonly isSaving = signal(false);
  isFromDashboard = false;
  curriculumMap: ICurriculumMap | null = null;

  coursesSharedCollection = signal<ICourse[]>([]);

  protected curriculumMapService = inject(CurriculumMapService);
  protected curriculumMapFormService = inject(CurriculumMapFormService);
  protected courseService = inject(CourseService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CurriculumMapFormGroup = this.curriculumMapFormService.createCurriculumMapFormGroup();

  compareCourse = (o1: ICourse | null, o2: ICourse | null): boolean => this.courseService.compareCourse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ curriculumMap }) => {
      this.curriculumMap = curriculumMap;
      if (curriculumMap) {
        this.updateForm(curriculumMap);
        if (curriculumMap && curriculumMap.id === -1) {
          this.isFromDashboard = true;
          this.editForm.patchValue({
            id: null,
          });
        }
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const curriculumMap = this.curriculumMapFormService.getCurriculumMap(this.editForm);
    if (curriculumMap.id === null) {
      this.subscribeToSaveResponse(this.curriculumMapService.create(curriculumMap));
    } else {
      this.subscribeToSaveResponse(this.curriculumMapService.update(curriculumMap));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ICurriculumMap | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(curriculumMap: ICurriculumMap): void {
    this.curriculumMap = curriculumMap;
    this.curriculumMapFormService.resetForm(this.editForm, curriculumMap);

    this.coursesSharedCollection.update(courses =>
      this.courseService.addCourseToCollectionIfMissing<ICourse>(courses, curriculumMap.course),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing<ICourse>(courses, this.curriculumMap?.course)))
      .subscribe((courses: ICourse[]) => this.coursesSharedCollection.set(courses));
  }
}
