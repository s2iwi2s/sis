import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { AssessmentService } from '../service/assessment.service';
import { IAssessment } from '../assessment.model';
import { AssessmentFormService, AssessmentFormGroup } from './assessment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-assessment-update',
  templateUrl: './assessment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AssessmentUpdateComponent implements OnInit {
  isSaving = false;
  assessment: IAssessment | null = null;

  learningCompetenciesSharedCollection: ILearningCompetency[] = [];

  editForm: AssessmentFormGroup = this.assessmentFormService.createAssessmentFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected assessmentService: AssessmentService,
    protected assessmentFormService: AssessmentFormService,
    protected learningCompetencyService: LearningCompetencyService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareLearningCompetency = (o1: ILearningCompetency | null, o2: ILearningCompetency | null): boolean =>
    this.learningCompetencyService.compareLearningCompetency(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assessment }) => {
      this.assessment = assessment;
      if (assessment) {
        this.updateForm(assessment);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('schInfoSysApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const assessment = this.assessmentFormService.getAssessment(this.editForm);
    if (assessment.id !== null) {
      this.subscribeToSaveResponse(this.assessmentService.update(assessment));
    } else {
      this.subscribeToSaveResponse(this.assessmentService.create(assessment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssessment>>): void {
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

  protected updateForm(assessment: IAssessment): void {
    this.assessment = assessment;
    this.assessmentFormService.resetForm(this.editForm, assessment);

    this.learningCompetenciesSharedCollection =
      this.learningCompetencyService.addLearningCompetencyToCollectionIfMissing<ILearningCompetency>(
        this.learningCompetenciesSharedCollection,
        assessment.learningCompetency,
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
            this.assessment?.learningCompetency,
          ),
        ),
      )
      .subscribe((learningCompetencies: ILearningCompetency[]) => (this.learningCompetenciesSharedCollection = learningCompetencies));
  }
}
