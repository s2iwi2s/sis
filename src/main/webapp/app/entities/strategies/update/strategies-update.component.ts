import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { IStrategies } from '../strategies.model';
import { StrategiesService } from '../service/strategies.service';
import { StrategiesFormService, StrategiesFormGroup } from './strategies-form.service';

@Component({
  standalone: true,
  selector: 'jhi-strategies-update',
  templateUrl: './strategies-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StrategiesUpdateComponent implements OnInit {
  isSaving = false;
  strategies: IStrategies | null = null;

  learningCompetenciesSharedCollection: ILearningCompetency[] = [];

  editForm: StrategiesFormGroup = this.strategiesFormService.createStrategiesFormGroup();

  constructor(
    protected strategiesService: StrategiesService,
    protected strategiesFormService: StrategiesFormService,
    protected learningCompetencyService: LearningCompetencyService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareLearningCompetency = (o1: ILearningCompetency | null, o2: ILearningCompetency | null): boolean =>
    this.learningCompetencyService.compareLearningCompetency(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ strategies }) => {
      this.strategies = strategies;
      if (strategies) {
        this.updateForm(strategies);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const strategies = this.strategiesFormService.getStrategies(this.editForm);
    if (strategies.id !== null) {
      this.subscribeToSaveResponse(this.strategiesService.update(strategies));
    } else {
      this.subscribeToSaveResponse(this.strategiesService.create(strategies));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStrategies>>): void {
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

  protected updateForm(strategies: IStrategies): void {
    this.strategies = strategies;
    this.strategiesFormService.resetForm(this.editForm, strategies);

    this.learningCompetenciesSharedCollection =
      this.learningCompetencyService.addLearningCompetencyToCollectionIfMissing<ILearningCompetency>(
        this.learningCompetenciesSharedCollection,
        strategies.learningCompetency,
      );
  }

  protected loadRelationshipsOptions(): void {
    this.learningCompetencyService
      .query()
      .pipe(map((res: HttpResponse<ILearningCompetency[]>) => res.body ?? []))
      .pipe(
        map((learningCompetencies: ILearningCompetency[]) =>
          this.learningCompetencyService.addLearningCompetencyToCollectionIfMissing<ILearningCompetency>(
            learningCompetencies,
            this.strategies?.learningCompetency,
          ),
        ),
      )
      .subscribe((learningCompetencies: ILearningCompetency[]) => (this.learningCompetenciesSharedCollection = learningCompetencies));
  }
}
