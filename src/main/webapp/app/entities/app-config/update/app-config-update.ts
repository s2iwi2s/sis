import { ChangeDetectionStrategy, Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize } from 'rxjs';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { AlertErrorModel } from 'app/shared/alert/alert-error.model';
import { TranslateDirective } from 'app/shared/language';
import { IAppConfig } from '../app-config.model';
import { AppConfigService } from '../service/app-config.service';

import { AppConfigFormGroup, AppConfigFormService } from './app-config-form.service';
import { Alert } from '../../../shared/alert/alert';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-app-config-update',
  templateUrl: './app-config-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, NgbAlert, Alert, AlertError, ReactiveFormsModule],
})
export class AppConfigUpdate implements OnInit {
  readonly isSaving = signal(false);
  readonly successMessage = signal('');
  readonly selfClosingAlert = viewChild<NgbAlert>('selfClosingAlert');

  appConfig: IAppConfig | null = null;

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected appConfigService = inject(AppConfigService);
  protected appConfigFormService = inject(AppConfigFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AppConfigFormGroup = this.appConfigFormService.createAppConfigFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appConfig }) => {
      this.appConfig = appConfig;
      if (appConfig) {
        this.updateForm(appConfig);
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
    const appConfig = this.appConfigFormService.getAppConfig(this.editForm);
    if (appConfig.id === null) {
      this.subscribeToSaveResponse(this.appConfigService.create(appConfig));
    } else {
      this.subscribeToSaveResponse(this.appConfigService.update(appConfig));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IAppConfig | null>): void {
    result.subscribe({
      next: appConfigRes => this.onSaveSuccess(appConfigRes),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(savedConfig: IAppConfig | null): void {
    const type = this.editForm.getRawValue().id === null ? 'created' : 'updated';
    //this.previousState();
    this.setMessage(`A Config ${savedConfig?.code} is ${type}`);
    if (type === 'created') {
      this.updateForm({} as IAppConfig);
    } else {
      this.updateForm(savedConfig ?? ({} as IAppConfig)); //({id: savedConfig?.id || null, ...savedConfig});
    }

    this.isSaving.set(false);
  }

  protected setMessage(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.selfClosingAlert()?.close(), 5000);
  }

  protected onSaveError(): void {
    // Api for inheritance.

    this.isSaving.set(false);
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(appConfig: IAppConfig): void {
    this.appConfig = appConfig;
    this.appConfigFormService.resetForm(this.editForm, appConfig);
  }
}
