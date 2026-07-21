import { Component, inject, OnInit, signal } from '@angular/core';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import TranslateDirective from '../../../shared/language/translate.directive';
import { ICurriculumMap } from '../../../entities/curriculum-map/curriculum-map.model';
import { ICourse } from '../../../entities/course/course.model';
import { CourseService } from '../../../entities/course/service/course.service';
import {
  CurriculumMapService,
  EntityArrayResponseType as CurriculumMapEntityArrayResponseType,
} from '../../../entities/curriculum-map/service/curriculum-map.service';
import {
  EntityArrayResponseType as LearningCompetencyEntityArrayResponseType,
  LearningCompetencyService,
} from '../../../entities/learning-competency/service/learning-competency.service';
import { ILearningCompetency } from '../../../entities/learning-competency/learning-competency.model';
import {
  StrategiesService,
  EntityArrayResponseType as StrategiesEntityArrayResponseType,
} from '../../../entities/strategies/service/strategies.service';
import { IStrategies } from '../../../entities/strategies/strategies.model';
import { IAssessment } from '../../../entities/assessment/assessment.model';
import {
  AssessmentService,
  EntityArrayResponseType as AssessmentEntityArrayResponseType,
} from '../../../entities/assessment/service/assessment.service';
import { CourseDetailCardComponent } from '../course-detail-card/course-detail-card.component';
import { QuarterCardComponent } from '../quarter-card/quarter-card.component';
import { ScopeSeqCardComponent } from '../scope-seq-card/scope-seq-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurriculumMappingService } from '../curriculum-mapping.service';

@Component({
  selector: 'jhi-curriculum-mapping-view',
  templateUrl: './curriculum-mapping-view.component.html',
  styleUrl: './curriculum-mapping-view.component.scss',
  imports: [
    NgbTypeaheadModule,
    FormsModule,
    TranslateDirective,
    CourseDetailCardComponent,
    QuarterCardComponent,
    ScopeSeqCardComponent,
    RouterLink,
    FontAwesomeModule,
    Alert,
    AlertError,
  ],
})
export class CurriculumMappingViewComponent implements OnInit {
  protected readonly curriculumMappingService = inject(CurriculumMappingService);
  protected activatedRoute = inject(ActivatedRoute);
  protected readonly courseService = inject(CourseService);
  protected readonly curriculumMapService = inject(CurriculumMapService);
  protected readonly learningCompetencyService = inject(LearningCompetencyService);
  protected readonly strategiesService = inject(StrategiesService);
  protected readonly assessmentService = inject(AssessmentService);

  constructor() {
    this.curriculumMappingService.clear();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.curriculumMappingService.loadCurriculumMappings(course);
    });

    this.curriculumMappingService.loadCourses();
  }
}
