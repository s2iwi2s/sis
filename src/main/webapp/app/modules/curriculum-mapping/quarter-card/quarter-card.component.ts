import {Component, Input} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import TranslateDirective from "../../../shared/language/translate.directive";
import {ICourse} from "../../../entities/course/course.model";
import {ICurriculumMap} from "../../../entities/curriculum-map/curriculum-map.model";
import {ILearningCompetency} from "../../../entities/learning-competency/learning-competency.model";
import {IStrategies} from "../../../entities/strategies/strategies.model";
import {IAssessment} from "../../../entities/assessment/assessment.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'jhi-quarter-card',
  standalone: true,
  imports: [
    FaIconComponent,
    TranslateDirective,
    RouterLink
  ],
  templateUrl: './quarter-card.component.html'
})
export class QuarterCardComponent {
  @Input() selectedCourse: ICourse| null = null;
  @Input() curMapByQuarter: Map<number, ICurriculumMap[]> = new Map();
  @Input() selectedQuarter: number = 1;

  @Input() lcMap: Map<number, ILearningCompetency[]> = new Map();
  @Input() sMap: Map<number, IStrategies[]> = new Map();
  @Input() aMap: Map<number, IAssessment[]> = new Map();

  getLearningCompetenciesFromMapping(currMapId: number): ILearningCompetency[] {
    return this.lcMap.get(currMapId) ?? [];
  }

  getStrategiesFromMapping(learningCompetencyId: number): IStrategies[] {
    return this.sMap.get(learningCompetencyId) ?? [];
  }

  getAssessmentFromMapping(learningCompetencyId: number): IAssessment[] {
    return this.aMap.get(learningCompetencyId) ?? [];
  }
}
