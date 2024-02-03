/* eslint-disable @typescript-eslint/require-await */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, switchMap } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IResources } from 'app/entities/resources/resources.model';
import { ResourcesService } from 'app/entities/resources/service/resources.service';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { AssessmentService } from '../service/assessment.service';
import { IAssessment } from '../assessment.model';
import { AssessmentFormGroup, AssessmentFormService } from './assessment-form.service';
import { OPT_TINY_MCE } from "../../../app.constants";
import { ITEM_DELETED_EVENT, ITEM_SAVED_EVENT, ITEM_UPLOADED_EVENT } from "../../../config/navigation.constants";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ResourcesDeleteDialogComponent } from "../../resources/delete/resources-delete-dialog.component";
import { ResourcesUploadDialogComponent } from "../../resources/upload-dialog/resources-upload-dialog.component";

@Component({
  standalone: true,
  selector: 'jhi-assessment-update',
  templateUrl: './assessment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AssessmentUpdateComponent implements OnInit {
  isSaving = false;
  assessment: IAssessment | null = null;

  tinyMCEOptions = OPT_TINY_MCE;

  resourcesSharedCollection: IResources[] = [];
  learningCompetenciesSharedCollection: ILearningCompetency[] = [];

  editForm: AssessmentFormGroup = this.assessmentFormService.createAssessmentFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected assessmentService: AssessmentService,
    protected assessmentFormService: AssessmentFormService,
    protected resourcesService: ResourcesService,
    protected learningCompetencyService: LearningCompetencyService,
    protected activatedRoute: ActivatedRoute,
    protected resourcesDeleteDialogModalService: NgbModal,
    protected resourcesUploadDialogModalService: NgbModal,
  ) { }

  compareResources = (o1: IResources | null, o2: IResources | null): boolean => this.resourcesService.compareResources(o1, o2);

  compareLearningCompetency = (o1: ILearningCompetency | null, o2: ILearningCompetency | null): boolean =>
    this.learningCompetencyService.compareLearningCompetency(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assessment }) => {
      this.assessment = assessment;
      if (assessment) {
        this.updateForm(assessment);
        if(assessment.id === -1){
          this.editForm.patchValue({
            id: null
          })
        }
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

  baseUrl(api: string): string {
    const url = window.location.href;
    return url.split('/assessment')[0] + api;
  }

  onClipboardCopy(successful: boolean): void {
    ;
  }

  deleteResource(resources: IResources): void {
    const modalRef = this.resourcesDeleteDialogModalService.open(ResourcesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resources = resources;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(async () => this.deleteResourceResponse(resources)),
      )
      .subscribe();
  }

  deleteResourceResponse(resources: IResources): void {
    this.deleteResourceFromForm(resources);
    this.loadRelationshipsOptions();
  }

  showAddImagesForm(): void {
    const modalRef = this.resourcesUploadDialogModalService.open(ResourcesUploadDialogComponent, { size: 'lg', backdrop: 'static' });
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_UPLOADED_EVENT),
        switchMap(async () => {
          modalRef.componentInstance.save((resourcesAry: Pick<IResources, "id" | "fileName" | "documentContentType">[], activeModal: NgbActiveModal) => {
            if (this.assessment) {
              this.assessment.resources = [...(this.assessment.resources ? this.assessment.resources : []), ...resourcesAry];
              this.assessmentService.update(this.assessment).subscribe(ret => {
                this.updateForm(this.assessment ? this.assessment : { id: 0 });
                this.loadRelationshipsOptions()
              });
            }
          });
        }),
      )
      .subscribe();
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

    this.resourcesSharedCollection = this.resourcesService.addResourcesToCollectionIfMissing<IResources>(
      this.resourcesSharedCollection,
      ...(assessment.resources ?? []),
    );
    this.learningCompetenciesSharedCollection =
      this.learningCompetencyService.addLearningCompetencyToCollectionIfMissing<ILearningCompetency>(
        this.learningCompetenciesSharedCollection,
        assessment.learningCompetency,
      );
  }

  protected loadRelationshipsOptions(): void {
    this.resourcesService.queryResourcesByAssessmentId(this.assessment?.id ?? 0)
      .pipe(map((res: HttpResponse<IResources[]>) => res.body ?? []))
      .pipe(
        map((resources: IResources[]) => this.resourcesService.addResourcesToCollectionIfMissing<IResources>(resources, ...(this.assessment?.resources ?? []))),
      )
      .subscribe((resources: IResources[]) => (this.resourcesSharedCollection = resources));

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

  private deleteResourceFromForm(resourceToRemove: IResources): void {
    if (this.assessment) {
      if (!this.assessment.resources) {
        this.assessment.resources = [];
      }
      this.assessment.resources = this.assessment.resources.filter(r => r.id !== resourceToRemove.id);
      this.editForm.patchValue({
        resources: this.assessment.resources
      })
    }
  }
}
