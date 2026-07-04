import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IDepartments } from '../departments.model';
import { DepartmentsService } from '../service/departments.service';

import { DepartmentsFormGroup, DepartmentsFormService } from './departments-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-departments-update',
  templateUrl: './departments-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class DepartmentsUpdate implements OnInit {
  readonly isSaving = signal(false);
  departments: IDepartments | null = null;

  protected departmentsService = inject(DepartmentsService);
  protected departmentsFormService = inject(DepartmentsFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DepartmentsFormGroup = this.departmentsFormService.createDepartmentsFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ departments }) => {
      this.departments = departments;
      if (departments) {
        this.updateForm(departments);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const departments = this.departmentsFormService.getDepartments(this.editForm);
    if (departments.id === null) {
      this.subscribeToSaveResponse(this.departmentsService.create(departments));
    } else {
      this.subscribeToSaveResponse(this.departmentsService.update(departments));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IDepartments | null>): void {
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

  protected updateForm(departments: IDepartments): void {
    this.departments = departments;
    this.departmentsFormService.resetForm(this.editForm, departments);
  }
}
