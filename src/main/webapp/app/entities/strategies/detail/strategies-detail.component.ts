import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IStrategies } from '../strategies.model';
import {FormsModule} from "@angular/forms";
import {OPT_TINY_MCE_DISABLED} from "../../../app.constants";

@Component({
  standalone: true,
  selector: 'jhi-strategies-detail',
  templateUrl: './strategies-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule],
})
export class StrategiesDetailComponent {
  @Input() strategies: IStrategies | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }

  protected readonly tinyMCEDisabledOptions = OPT_TINY_MCE_DISABLED;
}
