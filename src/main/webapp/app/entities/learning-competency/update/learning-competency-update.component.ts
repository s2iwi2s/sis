import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';
import { CurriculumMapService } from 'app/entities/curriculum-map/service/curriculum-map.service';
import { ILearningCompetency } from '../learning-competency.model';
import { LearningCompetencyService } from '../service/learning-competency.service';
import { LearningCompetencyFormService, LearningCompetencyFormGroup } from './learning-competency-form.service';

@Component({
  standalone: true,
  selector: 'jhi-learning-competency-update',
  templateUrl: './learning-competency-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LearningCompetencyUpdateComponent implements OnInit {
  isSaving = false;
  learningCompetency: ILearningCompetency | null = null;

  curriculumMapsSharedCollection: ICurriculumMap[] = [];

  editForm: LearningCompetencyFormGroup = this.learningCompetencyFormService.createLearningCompetencyFormGroup();

  constructor(
    protected learningCompetencyService: LearningCompetencyService,
    protected learningCompetencyFormService: LearningCompetencyFormService,
    protected curriculumMapService: CurriculumMapService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCurriculumMap = (o1: ICurriculumMap | null, o2: ICurriculumMap | null): boolean =>
    this.curriculumMapService.compareCurriculumMap(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ learningCompetency }) => {
      this.learningCompetency = learningCompetency;
      if (learningCompetency) {
        this.updateForm(learningCompetency);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const learningCompetency = this.learningCompetencyFormService.getLearningCompetency(this.editForm);
    if (learningCompetency.id !== null) {
      this.subscribeToSaveResponse(this.learningCompetencyService.update(learningCompetency));
    } else {
      this.subscribeToSaveResponse(this.learningCompetencyService.create(learningCompetency));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILearningCompetency>>): void {
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

  protected updateForm(learningCompetency: ILearningCompetency): void {
    this.learningCompetency = learningCompetency;
    this.learningCompetencyFormService.resetForm(this.editForm, learningCompetency);
    if(learningCompetency.id === -1){
      this.editForm.patchValue({
        id: null
      })
    }

    this.curriculumMapsSharedCollection = this.curriculumMapService.addCurriculumMapToCollectionIfMissing<ICurriculumMap>(
      this.curriculumMapsSharedCollection,
      learningCompetency.curriculumMap,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.curriculumMapService
      .query()
      .pipe(map((res: HttpResponse<ICurriculumMap[]>) => res.body ?? []))
      .pipe(
        map((curriculumMaps: ICurriculumMap[]) =>
          this.curriculumMapService.addCurriculumMapToCollectionIfMissing<ICurriculumMap>(
            curriculumMaps,
            this.learningCompetency?.curriculumMap,
          ),
        ),
      )
      .subscribe((curriculumMaps: ICurriculumMap[]) => (this.curriculumMapsSharedCollection = curriculumMaps));
  }
}
