import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
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

  editForm: ResourcesFormGroup = this.resourcesFormService.createResourcesFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected resourcesService: ResourcesService,
    protected resourcesFormService: ResourcesFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resources }) => {
      this.resources = resources;
      if (resources) {
        this.updateForm(resources);
      }
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
  }
}
