import { Component, inject, Input } from '@angular/core';
import { ICourse } from '../../../entities/course/course.model';
import TranslateDirective from '../../../shared/language/translate.directive';
import { HtmlUtilService } from '../../../core/util/html-util.service';
import { RouterLink } from '@angular/router';
import { DataUtils } from '../../../core/util/data-util.service';
import { CurriculumMappingService } from '../curriculum-mapping.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReportsService } from '../../report/reports-service';

@Component({
  selector: 'jhi-course-detail-card',
  standalone: true,
  imports: [TranslateDirective, RouterLink, FaIconComponent],
  templateUrl: './course-detail-card.component.html',
})
export class CourseDetailCardComponent {
  @Input() selectedCourse: ICourse | null = null;
  isdl = false;

  protected dataUtils = inject(DataUtils);
  protected htmlUtilService = inject(HtmlUtilService);
  protected curriculumMappingService = inject(CurriculumMappingService);
  protected reportsService = inject(ReportsService);

  downloadPdf(courseId: number): void {
    this.reportsService.downloadPdf(this.curriculumMappingService.find(courseId)).subscribe(() => (this.isdl = false));
  }
}
