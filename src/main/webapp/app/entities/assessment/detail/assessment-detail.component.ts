import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { DataUtils } from 'app/core/util/data-util.service';
import { IAssessment } from '../assessment.model';
import {OPT_TINY_MCE, OPT_TINY_MCE_DISABLED} from "../../../app.constants";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  standalone: true,
  selector: 'jhi-assessment-detail',
  templateUrl: './assessment-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule, ReactiveFormsModule],
})
export class AssessmentDetailComponent {
  @Input() assessment: IAssessment | null = null;

  protected readonly tinyMCEOptions = OPT_TINY_MCE;

  protected readonly tinyMCEDisabledOptions = OPT_TINY_MCE_DISABLED;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
  ) {}

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
