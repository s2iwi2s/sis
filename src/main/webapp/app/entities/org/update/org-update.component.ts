import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IOrg } from '../org.model';
import { OrgService } from '../service/org.service';
import { OrgFormService, OrgFormGroup } from './org-form.service';

@Component({
  standalone: true,
  selector: 'jhi-org-update',
  templateUrl: './org-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrgUpdateComponent implements OnInit {
  isSaving = false;
  org: IOrg | null = null;

  currSchYrsCollection: IAppConfig[] = [];

  editForm: OrgFormGroup = this.orgFormService.createOrgFormGroup();

  constructor(
    protected orgService: OrgService,
    protected orgFormService: OrgFormService,
    protected appConfigService: AppConfigService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ org }) => {
      this.org = org;
      if (org) {
        this.updateForm(org);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const org = this.orgFormService.getOrg(this.editForm);
    if (org.id !== null) {
      this.subscribeToSaveResponse(this.orgService.update(org));
    } else {
      this.subscribeToSaveResponse(this.orgService.create(org));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrg>>): void {
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

  protected updateForm(org: IOrg): void {
    this.org = org;
    this.orgFormService.resetForm(this.editForm, org);

    this.currSchYrsCollection = this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(
      this.currSchYrsCollection,
      org.currSchYr,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ filter: 'org-is-null' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.org?.currSchYr),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => (this.currSchYrsCollection = appConfigs));
  }
}
