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
import { IStrategies } from 'app/entities/strategies/strategies.model';
import { StrategiesService } from 'app/entities/strategies/service/strategies.service';
import { IAssessment } from 'app/entities/assessment/assessment.model';
import { AssessmentService } from 'app/entities/assessment/service/assessment.service';
import { ResourcesService } from '../service/resources.service';
import { IResources } from '../resources.model';
import { ResourcesFormService, ResourcesFormGroup } from './resources-form.service';

@Component({
  standalone: true,
  selector: 'jhi-resources-update',
  templateUrl: './resources-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ResourcesUpdateComponent implements OnInit {
  isSaving = false;
  resources: IResources | null = null;

  strategiesSharedCollection: IStrategies[] = [];
  assessmentsSharedCollection: IAssessment[] = [];

  editForm: ResourcesFormGroup = this.resourcesFormService.createResourcesFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected resourcesService: ResourcesService,
    protected resourcesFormService: ResourcesFormService,
    protected strategiesService: StrategiesService,
    protected assessmentService: AssessmentService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareStrategies = (o1: IStrategies | null, o2: IStrategies | null): boolean => this.strategiesService.compareStrategies(o1, o2);

  compareAssessment = (o1: IAssessment | null, o2: IAssessment | null): boolean => this.assessmentService.compareAssessment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resources }) => {
      this.resources = resources;
      if (resources) {
        this.updateForm(resources);
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
    const resources = this.resourcesFormService.getResources(this.editForm);
    if (resources.id !== null) {
      this.subscribeToSaveResponse(this.resourcesService.update(resources));
    } else {
      this.subscribeToSaveResponse(this.resourcesService.create(resources));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResources>>): void {
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

  protected updateForm(resources: IResources): void {
    this.resources = resources;
    this.resourcesFormService.resetForm(this.editForm, resources);

    this.strategiesSharedCollection = this.strategiesService.addStrategiesToCollectionIfMissing<IStrategies>(
      this.strategiesSharedCollection,
      resources.strategies,
    );
    this.assessmentsSharedCollection = this.assessmentService.addAssessmentToCollectionIfMissing<IAssessment>(
      this.assessmentsSharedCollection,
      resources.assessment,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.strategiesService
      .query()
      .pipe(map((res: HttpResponse<IStrategies[]>) => res.body ?? []))
      .pipe(
        map((strategies: IStrategies[]) =>
          this.strategiesService.addStrategiesToCollectionIfMissing<IStrategies>(strategies, this.resources?.strategies),
        ),
      )
      .subscribe((strategies: IStrategies[]) => (this.strategiesSharedCollection = strategies));

    this.assessmentService
      .query()
      .pipe(map((res: HttpResponse<IAssessment[]>) => res.body ?? []))
      .pipe(
        map((assessments: IAssessment[]) =>
          this.assessmentService.addAssessmentToCollectionIfMissing<IAssessment>(assessments, this.resources?.assessment),
        ),
      )
      .subscribe((assessments: IAssessment[]) => (this.assessmentsSharedCollection = assessments));
  }
}
