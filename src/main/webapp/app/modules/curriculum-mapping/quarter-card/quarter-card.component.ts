import { Component, input, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import TranslateDirective from '../../../shared/language/translate.directive';
import { ICourse } from '../../../entities/course/course.model';
import { ICurriculumMap } from '../../../entities/curriculum-map/curriculum-map.model';
import { ILearningCompetency } from '../../../entities/learning-competency/learning-competency.model';
import { IStrategies } from '../../../entities/strategies/strategies.model';
import { IAssessment } from '../../../entities/assessment/assessment.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jhi-quarter-card',
  standalone: true,
  imports: [FaIconComponent, TranslateDirective, RouterLink],
  templateUrl: './quarter-card.component.html',
})
export class QuarterCardComponent {
  selectedCourse = input<ICourse>();
  curMapByQuarter = input<Map<string, ICurriculumMap[]>>();
  selectedQuarter = input(1);

  lcMap = input<Map<string, ILearningCompetency[]>>();
  sMap = input<Map<string, IStrategies[]>>();
  aMap = input<Map<string, IAssessment[]>>();

  getLearningCompetenciesFromMapping(currMapId: number): ILearningCompetency[] {
    const array = this.lcMap()?.get(`${currMapId}`) ?? [];
    array.sort((a, b) => (a.seqNo ?? 0) - (b.seqNo ?? 0));
    return array;
  }

  getStrategiesFromMapping(learningCompetencyId: number): IStrategies[] {
    const array = this.sMap()?.get(`${learningCompetencyId}`) ?? [];
    array.sort((a, b) => a.id - b.id);
    return this.sMap()?.get(`${learningCompetencyId}`) ?? [];
  }

  getAssessmentFromMapping(learningCompetencyId: number): IAssessment[] {
    const array = this.aMap()?.get(`${learningCompetencyId}`) ?? [];
    array.sort((a, b) => a.id - b.id);
    return array;
  }
}
