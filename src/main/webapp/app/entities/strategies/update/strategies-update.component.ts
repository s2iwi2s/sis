import {Component, OnInit} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {filter, Observable, switchMap} from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";


import { IResources } from 'app/entities/resources/resources.model';
import { ResourcesService } from 'app/entities/resources/service/resources.service';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { StrategiesService } from '../service/strategies.service';
import { IStrategies } from '../strategies.model';
import { StrategiesFormService, StrategiesFormGroup } from './strategies-form.service';
import { OPT_TINY_MCE } from "../../../app.constants";
import {ApplicationConfigService} from "../../../core/config/application-config.service";
import {ITEM_DELETED_EVENT, ITEM_UPLOADED_EVENT} from "../../../config/navigation.constants";
import {ResourcesDeleteDialogComponent} from "../../resources/delete/resources-delete-dialog.component";
import {ResourcesUploadDialogComponent} from "../../resources/upload-dialog/resources-upload-dialog.component";

@Component({
  standalone: true,
  selector: 'jhi-strategies-update',
  templateUrl: './strategies-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, ],
})
export class StrategiesUpdateComponent implements OnInit {
  isSaving = false;
  strategies: IStrategies | null = null;

  tinyMCEOptions = OPT_TINY_MCE;

  resourcesSharedCollection: IResources[] = [];
  learningCompetenciesSharedCollection: ILearningCompetency[] = [];

  editForm: StrategiesFormGroup = this.strategiesFormService.createStrategiesFormGroup();

  constructor(
    protected strategiesService: StrategiesService,
    protected strategiesFormService: StrategiesFormService,
    protected resourcesService: ResourcesService,
    protected learningCompetencyService: LearningCompetencyService,
    protected applicationConfigService: ApplicationConfigService,
    protected activatedRoute: ActivatedRoute,
    protected resourcesDeleteDialogModalService: NgbModal,
    protected resourcesUploadDialogModalService: NgbModal,
  ) { }

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

  baseUrl(api: string): string {
    const url = window.location.href;
    return url.split('/strategies')[0] + api;
  }

  public onClipboardCopy(successful: boolean): void {
    console.log(successful);
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

    this.resourcesSharedCollection = this.resourcesService.addResourcesToCollectionIfMissing<IResources>(
      this.resourcesSharedCollection,
      ...(strategies.resources ?? []),
    );
    this.learningCompetenciesSharedCollection =
      this.learningCompetencyService.addLearningCompetencyToCollectionIfMissing<ILearningCompetency>(
        this.learningCompetenciesSharedCollection,
        strategies.learningCompetency,
      );
  }

  protected loadRelationshipsOptions(): void {

    this.resourcesService.queryResourcesByStrategiestId(this.strategies?.id??0)
      .pipe(map((res: HttpResponse<IResources[]>) => res.body ?? []))
      .pipe(
        map((resources: IResources[]) => {
          return this.resourcesService.addResourcesToCollectionIfMissing<IResources>(resources, ...(this.strategies?.resources ?? []))
        }),
      )
      .subscribe((resources: IResources[]) => (this.resourcesSharedCollection = resources));

    // this.resourcesService
    //   .query()
    //   .pipe(map((res: HttpResponse<IResources[]>) => res.body ?? []))
    //   .pipe(
    //     map((resources: IResources[]) =>
    //       this.resourcesService.addResourcesToCollectionIfMissing<IResources>(resources, ...(this.strategies?.resources ?? [])),
    //     ),
    //   )
    //   .subscribe((resources: IResources[]) => (this.resourcesSharedCollection = resources));

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

  deleteResource(resources: IResources) {
    const modalRef = this.resourcesDeleteDialogModalService.open(ResourcesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
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

  private deleteResourceFromForm(resourceToRemove: IResources) {
    if(this.strategies) {
      if(!this.strategies.resources) {
        this.strategies.resources = [];
      }
      this.strategies.resources = this.strategies.resources.filter(r => r.id !== resourceToRemove.id);
      this.editForm.patchValue({
        resources: this.strategies.resources
      })
    }
  }

  showAddImagesForm() {
    const modalRef = this.resourcesUploadDialogModalService.open(ResourcesUploadDialogComponent, { size: 'lg', backdrop: 'static' });
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_UPLOADED_EVENT),
        switchMap(async () => {
          modalRef.componentInstance.save((resourcesAry: Pick<IResources, "id" | "fileName" | "documentContentType">[], activeModal: NgbActiveModal) => {
            if(this.strategies){
              this.strategies.resources = [...(this.strategies?.resources ? this.strategies.resources : []), ...resourcesAry];
              this.strategiesService.update(this.strategies).subscribe(ret => {
                this.updateForm(this.strategies? this.strategies : {id: 0});
                this.loadRelationshipsOptions()
              });
            }
          });
        }),
      )
      .subscribe();
  }
}
