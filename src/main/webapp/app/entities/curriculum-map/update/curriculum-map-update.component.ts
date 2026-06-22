import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { ICurriculumMap } from '../curriculum-map.model';
import { CurriculumMapService } from '../service/curriculum-map.service';
import { CurriculumMapFormService, CurriculumMapFormGroup } from './curriculum-map-form.service';

@Component({
  standalone: true,
  selector: 'jhi-curriculum-map-update',
  templateUrl: './curriculum-map-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CurriculumMapUpdateComponent implements OnInit {
  isSaving = false;
  isFromDashboard = false;
  curriculumMap: ICurriculumMap | null = null;

  coursesSharedCollection: ICourse[] = [];

  editForm: CurriculumMapFormGroup = this.curriculumMapFormService.createCurriculumMapFormGroup();

  constructor(
    protected curriculumMapService: CurriculumMapService,
    protected curriculumMapFormService: CurriculumMapFormService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCourse = (o1: ICourse | null, o2: ICourse | null): boolean => this.courseService.compareCourse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ curriculumMap }) => {
      this.curriculumMap = curriculumMap;
      if (curriculumMap) {
        this.updateForm(curriculumMap);
        if(curriculumMap && curriculumMap.id === -1){
          this.isFromDashboard = true;
          this.editForm.patchValue({
            id: null
          });
        }
      }
      console.log(`isFromDashboard=>${this.isFromDashboard}`)

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const curriculumMap = this.curriculumMapFormService.getCurriculumMap(this.editForm);
    if (curriculumMap.id !== null) {
      this.subscribeToSaveResponse(this.curriculumMapService.update(curriculumMap));
    } else {
      this.subscribeToSaveResponse(this.curriculumMapService.create(curriculumMap));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurriculumMap>>): void {
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
    this.isSaving = false;
  }

  protected updateForm(curriculumMap: ICurriculumMap): void {
    this.curriculumMap = curriculumMap;
    this.curriculumMapFormService.resetForm(this.editForm, curriculumMap);

    this.coursesSharedCollection = this.courseService.addCourseToCollectionIfMissing<ICourse>(
      this.coursesSharedCollection,
      curriculumMap.course,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing<ICourse>(courses, this.curriculumMap?.course)))
      .subscribe((courses: ICourse[]) => (this.coursesSharedCollection = courses));
  }
}
