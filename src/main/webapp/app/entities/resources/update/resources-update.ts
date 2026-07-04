import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { IAssessment } from 'app/entities/assessment/assessment.model';
import { AssessmentService } from 'app/entities/assessment/service/assessment.service';
import { StrategiesService } from 'app/entities/strategies/service/strategies.service';
import { IStrategies } from 'app/entities/strategies/strategies.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';

import { IResources } from '../resources.model';
import { ResourcesService } from '../service/resources.service';

import { ResourcesFormGroup, ResourcesFormService } from './resources-form.service';
import { AlertErrorModel } from 'app/shared/alert/alert-error.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-resources-update',
  templateUrl: './resources-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class ResourcesUpdate implements OnInit {
  readonly isSaving = signal(false);
  resources: IResources | null = null;

  strategiesesSharedCollection = signal<IStrategies[]>([]);
  assessmentsSharedCollection = signal<IAssessment[]>([]);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected resourcesService = inject(ResourcesService);
  protected resourcesFormService = inject(ResourcesFormService);
  protected strategiesService = inject(StrategiesService);
  protected assessmentService = inject(AssessmentService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ResourcesFormGroup = this.resourcesFormService.createResourcesFormGroup();

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
        this.eventManager.broadcast(new EventWithContent<AlertErrorModel>('schInfoSysApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const resources = this.resourcesFormService.getResources(this.editForm);
    if (resources.id === null) {
      this.subscribeToSaveResponse(this.resourcesService.create(resources));
    } else {
      this.subscribeToSaveResponse(this.resourcesService.update(resources));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IResources | null>): void {
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

  protected updateForm(resources: IResources): void {
    this.resources = resources;
    this.resourcesFormService.resetForm(this.editForm, resources);

    this.strategiesesSharedCollection.update(strategieses =>
      this.strategiesService.addStrategiesToCollectionIfMissing<IStrategies>(strategieses, ...(resources.strategieses ?? [])),
    );
    this.assessmentsSharedCollection.update(assessments =>
      this.assessmentService.addAssessmentToCollectionIfMissing<IAssessment>(assessments, ...(resources.assessments ?? [])),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.strategiesService
      .query()
      .pipe(map((res: HttpResponse<IStrategies[]>) => res.body ?? []))
      .pipe(
        map((strategieses: IStrategies[]) =>
          this.strategiesService.addStrategiesToCollectionIfMissing<IStrategies>(strategieses, ...(this.resources?.strategieses ?? [])),
        ),
      )
      .subscribe((strategieses: IStrategies[]) => this.strategiesesSharedCollection.set(strategieses));

    this.assessmentService
      .query()
      .pipe(map((res: HttpResponse<IAssessment[]>) => res.body ?? []))
      .pipe(
        map((assessments: IAssessment[]) =>
          this.assessmentService.addAssessmentToCollectionIfMissing<IAssessment>(assessments, ...(this.resources?.assessments ?? [])),
        ),
      )
      .subscribe((assessments: IAssessment[]) => this.assessmentsSharedCollection.set(assessments));
  }
}
