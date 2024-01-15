import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IInstructor } from '../instructor.model';
import { InstructorService } from '../service/instructor.service';
import { InstructorFormService, InstructorFormGroup } from './instructor-form.service';
import { OPT_GENDER } from "../../../app.constants";

@Component({
  standalone: true,
  selector: 'jhi-instructor-update',
  templateUrl: './instructor-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InstructorUpdateComponent implements OnInit {
  isSaving = false;
  instructor: IInstructor | null = null;

  gendersCollection: IAppConfig[] = [];

  editForm: InstructorFormGroup = this.instructorFormService.createInstructorFormGroup();

  constructor(
    protected instructorService: InstructorService,
    protected instructorFormService: InstructorFormService,
    protected appConfigService: AppConfigService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ instructor }) => {
      this.instructor = instructor;
      if (instructor) {
        this.updateForm(instructor);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const instructor = this.instructorFormService.getInstructor(this.editForm);
    if (instructor.id !== null) {
      this.subscribeToSaveResponse(this.instructorService.update(instructor));
    } else {
      this.subscribeToSaveResponse(this.instructorService.create(instructor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstructor>>): void {
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

  protected updateForm(instructor: IInstructor): void {
    this.instructor = instructor;
    this.instructorFormService.resetForm(this.editForm, instructor);

    this.gendersCollection = this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gendersCollection, instructor.gender);
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query(OPT_GENDER)
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.instructor?.gender),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => (this.gendersCollection = appConfigs));
  }
}
