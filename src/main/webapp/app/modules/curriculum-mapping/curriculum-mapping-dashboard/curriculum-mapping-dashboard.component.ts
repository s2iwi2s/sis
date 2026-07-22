import { Component, inject, OnInit } from '@angular/core';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseDetailCardComponent } from '../course-detail-card/course-detail-card.component';
import { ScopeSeqCardComponent } from '../scope-seq-card/scope-seq-card.component';
import { QuarterCardComponent } from '../quarter-card/quarter-card.component';
import { AlertError } from '../../../shared/alert/alert-error';
import { Alert } from '../../../shared/alert/alert';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurriculumMappingService } from '../curriculum-mapping.service';
import { ICourse } from '../../../entities/course/course.model';

@Component({
  selector: 'jhi-curriculum-mapping-dashboard',
  standalone: true,
  imports: [
    NgbTypeaheadModule,
    FormsModule,
    RouterLink,
    CourseDetailCardComponent,
    ScopeSeqCardComponent,
    QuarterCardComponent,
    AlertError,
    Alert,
    FontAwesomeModule,
  ],
  templateUrl: './curriculum-mapping-dashboard.component.html',
})
export class CurriculumMappingDashboardComponent implements OnInit {
  protected curriculumMappingService = inject(CurriculumMappingService);
  protected activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.curriculumMappingService.clear();
    this.curriculumMappingService.loadCourses();
    if (this.curriculumMappingService.selectedCourse?.id) {
      this.loadCurriculumMappings(this.curriculumMappingService.selectedCourse);
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.loadCurriculumMappings(course);
    });
  }

  loadCurriculumMappings(course: ICourse | null): void {
    this.curriculumMappingService.loadCurriculumMappings(course);
  }
}
