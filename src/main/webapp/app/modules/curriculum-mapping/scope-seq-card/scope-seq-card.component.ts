/* eslint-disable no-console */

import { Component, inject, input, output } from '@angular/core';
import { ICourse } from '../../../entities/course/course.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { ICurriculumMap } from '../../../entities/curriculum-map/curriculum-map.model';
import TranslateDirective from '../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-scope-seq-card',
  standalone: true,
  imports: [FaIconComponent, RouterLink, TranslateDirective],
  templateUrl: './scope-seq-card.component.html',
})
export class ScopeSeqCardComponent {
  selectedCourse = input<ICourse>();
  curMapByQuarter = input<Map<string, ICurriculumMap[]>>();
  selectedQuarter = input<number>(1);
  hasCurMap = input(false);

  selectedQuarterOutput = output<number>();

  protected router = inject(Router);

  showQuarter(quarter: string): void {
    this.selectedQuarterOutput.emit(Math.abs(+quarter));
  }

  isSelectedQuarter(quarter: string): boolean {
    console.log(`EnrollmentForm.ngOnInit() called with quarter=${quarter}, selectedQuarter: ${this.selectedQuarter()}`);

    return Math.abs(this.selectedQuarter()) === Math.abs(+quarter);
  }
}
