import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';
import { CurriculumMapService } from 'app/entities/curriculum-map/service/curriculum-map.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ILearningCompetency } from '../learning-competency.model';
import { LearningCompetencyService } from '../service/learning-competency.service';

import { LearningCompetencyFormGroup, LearningCompetencyFormService } from './learning-competency-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-learning-competency-update',
  templateUrl: './learning-competency-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class LearningCompetencyUpdate implements OnInit {
  readonly isSaving = signal(false);
  learningCompetency: ILearningCompetency | null = null;

  curriculumMapsSharedCollection = signal<ICurriculumMap[]>([]);

  protected learningCompetencyService = inject(LearningCompetencyService);
  protected learningCompetencyFormService = inject(LearningCompetencyFormService);
  protected curriculumMapService = inject(CurriculumMapService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LearningCompetencyFormGroup = this.learningCompetencyFormService.createLearningCompetencyFormGroup();

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
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const learningCompetency = this.learningCompetencyFormService.getLearningCompetency(this.editForm);
    if (learningCompetency.id === null) {
      this.subscribeToSaveResponse(this.learningCompetencyService.create(learningCompetency));
    } else {
      this.subscribeToSaveResponse(this.learningCompetencyService.update(learningCompetency));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ILearningCompetency | null>): void {
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

  protected updateForm(learningCompetency: ILearningCompetency): void {
    this.learningCompetency = learningCompetency;
    this.learningCompetencyFormService.resetForm(this.editForm, learningCompetency);

    this.curriculumMapsSharedCollection.update(curriculumMaps =>
      this.curriculumMapService.addCurriculumMapToCollectionIfMissing<ICurriculumMap>(curriculumMaps, learningCompetency.curriculumMap),
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
      .subscribe((curriculumMaps: ICurriculumMap[]) => this.curriculumMapsSharedCollection.set(curriculumMaps));
  }
}
