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
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { AppConfigService } from '../service/app-config.service';
import { IAppConfig } from '../app-config.model';
import { AppConfigFormService, AppConfigFormGroup } from './app-config-form.service';

@Component({
  standalone: true,
  selector: 'jhi-app-config-update',
  templateUrl: './app-config-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AppConfigUpdateComponent implements OnInit {
  isSaving = false;
  appConfig: IAppConfig | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: AppConfigFormGroup = this.appConfigFormService.createAppConfigFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected appConfigService: AppConfigService,
    protected appConfigFormService: AppConfigFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appConfig }) => {
      this.appConfig = appConfig;
      if (appConfig) {
        this.updateForm(appConfig);
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
    const appConfig = this.appConfigFormService.getAppConfig(this.editForm);
    if (appConfig.id !== null) {
      this.subscribeToSaveResponse(this.appConfigService.update(appConfig));
    } else {
      this.subscribeToSaveResponse(this.appConfigService.create(appConfig));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppConfig>>): void {
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

  protected updateForm(appConfig: IAppConfig): void {
    this.appConfig = appConfig;
    this.appConfigFormService.resetForm(this.editForm, appConfig);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, appConfig.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.appConfig?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
