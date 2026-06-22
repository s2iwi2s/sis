import {Component, Input} from '@angular/core';
import {ICourse} from "../../../entities/course/course.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Router, RouterLink} from "@angular/router";
import {ICurriculumMap} from "../../../entities/curriculum-map/curriculum-map.model";
import {NgClass} from "@angular/common";
import TranslateDirective from "../../../shared/language/translate.directive";

@Component({
  selector: 'jhi-scope-seq-card',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink,
    NgClass,
    TranslateDirective
  ],
  templateUrl: './scope-seq-card.component.html'
})
export class ScopeSeqCardComponent {
  @Input() selectedCourse: ICourse| null = null;
  @Input() curMapByQuarter: Map<number, ICurriculumMap[]> = new Map();
  @Input() selectedQuarter: number = 1;
  @Input() hasCurMap = false;

  constructor(
    protected router: Router) {
  }

  showQuarter(quarter: number) {
    if (this.selectedQuarter !== -1 && this.selectedCourse) {
      this.router.navigate(['/', 'curriculum-mapping', 'dashboard', this.selectedCourse.id, quarter]);
    }
  }

  isSelectedQuarter(quarter: number) {
    return this.selectedQuarter === quarter;
  }
}
