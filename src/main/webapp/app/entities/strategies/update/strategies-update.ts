import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map, filter, switchMap } from 'rxjs';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { IResources } from 'app/entities/resources/resources.model';
import { ResourcesService } from 'app/entities/resources/service/resources.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';

import { StrategiesService } from '../service/strategies.service';
import { IStrategies } from '../strategies.model';

import { StrategiesFormGroup, StrategiesFormService } from './strategies-form.service';
import { AlertErrorModel } from 'app/shared/alert/alert-error.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { ITEM_DELETED_EVENT, ITEM_UPLOADED_EVENT } from '../../../config/navigation.constants';
import { ResourcesUploadDialogComponent } from '../../resources/upload-dialog/resources-upload-dialog.component';
import { ResourcesDeleteDialog } from '../../resources/delete/resources-delete-dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-strategies-update',
  templateUrl: './strategies-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, ClipboardModule],
})
export class StrategiesUpdate implements OnInit {
  readonly isSaving = signal(false);
  strategies: IStrategies | null = null;

  resourcesesSharedCollection = signal<IResources[]>([]);
  learningCompetenciesSharedCollection = signal<ILearningCompetency[]>([]);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected strategiesService = inject(StrategiesService);
  protected strategiesFormService = inject(StrategiesFormService);
  protected resourcesService = inject(ResourcesService);
  protected learningCompetencyService = inject(LearningCompetencyService);
  protected activatedRoute = inject(ActivatedRoute);
  protected resourcesDeleteDialogModalService = inject(NgbModal);
  protected resourcesUploadDialogModalService = inject(NgbModal);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StrategiesFormGroup = this.strategiesFormService.createStrategiesFormGroup();

  compareResources = (o1: IResources | null, o2: IResources | null): boolean => this.resourcesService.compareResources(o1, o2);

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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertErrorModel>('schInfoSysApp.error', {
            ...err,
            key: `error.file.${err.key}`,
          }),
        ),
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const strategies = this.strategiesFormService.getStrategies(this.editForm);
    if (strategies.id === null) {
      this.subscribeToSaveResponse(this.strategiesService.create(strategies));
    } else {
      this.subscribeToSaveResponse(this.strategiesService.update(strategies));
    }
  }

  baseUrl(api: string): string {
    const url = window.location.href;
    return url.split('/strategies')[0] + api;
  }

  public onClipboardCopy(successful: boolean): void {}

  deleteResource(resources: IResources): void {
    const modalRef = this.resourcesDeleteDialogModalService.open(ResourcesDeleteDialog, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.resources = resources;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(async () => {
          this.deleteResourceFromForm(resources);
          this.loadRelationshipsOptions();
        }),
      )
      .subscribe();
  }

  showAddImagesForm(): void {
    const modalRef = this.resourcesUploadDialogModalService.open(ResourcesUploadDialogComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_UPLOADED_EVENT),
        switchMap(async () => {
          modalRef.componentInstance.save(
            (resourcesAry: Pick<IResources, 'id' | 'fileName' | 'documentContentType'>[], activeModal: NgbActiveModal) => {
              console.log('StrategiesUpdate.modalRef.componentInstance.save() called with resourcesAry:', resourcesAry);
              if (this.strategies) {
                this.strategies.resourceses = [...(this.strategies.resourceses ? this.strategies.resourceses : []), ...resourcesAry];
                console.log('StrategiesUpdate.modalRef.componentInstance.save() called with strategies:', this.strategies);
                this.strategiesService.update(this.strategies).subscribe(ret => {
                  this.updateForm(this.strategies ? this.strategies : { id: 0 });
                  this.loadRelationshipsOptions();
                });
              }
            },
          );
        }),
      )
      .subscribe();
  }

  private deleteResourceFromForm(resourceToRemove: IResources): void {
    if (this.strategies) {
      if (!this.strategies.resourceses) {
        this.strategies.resourceses = [];
      }
      this.strategies.resourceses = this.strategies.resourceses.filter(r => r.id !== resourceToRemove.id);
      this.editForm.patchValue({
        resourceses: this.strategies.resourceses,
      });
    }
  }

  protected subscribeToSaveResponse(result: Observable<IStrategies | null>): void {
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

  protected updateForm(strategies: IStrategies): void {
    this.strategies = strategies;
    this.strategiesFormService.resetForm(this.editForm, strategies);

    this.resourcesesSharedCollection.update(resourceses =>
      this.resourcesService.addResourcesToCollectionIfMissing<IResources>(resourceses, ...(strategies.resourceses ?? [])),
    );
    this.learningCompetenciesSharedCollection.update(learningCompetencies =>
      this.learningCompetencyService.addLearningCompetencyToCollectionIfMissing<ILearningCompetency>(
        learningCompetencies,
        strategies.learningCompetency,
      ),
    );
  }

  protected loadRelationshipsOptions(): void {
    /*
    this.resourcesService
      .query()
      .pipe(map((res: HttpResponse<IResources[]>) => res.body ?? []))
      .pipe(
        map((resourceses: IResources[]) =>
          this.resourcesService.addResourcesToCollectionIfMissing<IResources>(resourceses, ...(this.strategies?.resourceses ?? [])),
        ),
      )
      .subscribe((resourceses: IResources[]) => this.resourcesesSharedCollection.set(resourceses));

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
      .subscribe((learningCompetencies: ILearningCompetency[]) => this.learningCompetenciesSharedCollection.set(learningCompetencies));
     */
  }
}
