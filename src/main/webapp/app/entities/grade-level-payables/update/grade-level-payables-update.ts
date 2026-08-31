import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IGradeLevelPayables } from '../grade-level-payables.model';
import { GradeLevelPayablesService } from '../service/grade-level-payables.service';

import { GradeLevelPayablesFormGroup, GradeLevelPayablesFormService } from './grade-level-payables-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-grade-level-payables-update',
  templateUrl: './grade-level-payables-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class GradeLevelPayablesUpdate implements OnInit {
  readonly isSaving = signal(false);
  gradeLevelPayables: IGradeLevelPayables | null = null;

  gradelevelsCollection = signal<IAppConfig[]>([]);

  protected gradeLevelPayablesService = inject(GradeLevelPayablesService);
  protected gradeLevelPayablesFormService = inject(GradeLevelPayablesFormService);
  protected appConfigService = inject(AppConfigService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GradeLevelPayablesFormGroup = this.gradeLevelPayablesFormService.createGradeLevelPayablesFormGroup();

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gradeLevelPayables }) => {
      this.gradeLevelPayables = gradeLevelPayables;
      if (gradeLevelPayables) {
        this.updateForm(gradeLevelPayables);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const gradeLevelPayables = this.gradeLevelPayablesFormService.getGradeLevelPayables(this.editForm);
    if (gradeLevelPayables.id === null) {
      this.subscribeToSaveResponse(this.gradeLevelPayablesService.create(gradeLevelPayables));
    } else {
      this.subscribeToSaveResponse(this.gradeLevelPayablesService.update(gradeLevelPayables));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IGradeLevelPayables | null>): void {
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

  protected updateForm(gradeLevelPayables: IGradeLevelPayables): void {
    this.gradeLevelPayables = gradeLevelPayables;
    this.gradeLevelPayablesFormService.resetForm(this.editForm, gradeLevelPayables);

    this.gradelevelsCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gradelevelsCollection(), gradeLevelPayables.gradelevel),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ filter: 'gradelevelpayables-is-null' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.gradeLevelPayables?.gradelevel),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => this.gradelevelsCollection.set(appConfigs));
  }
}
