import { Component, inject, Input } from '@angular/core';
import { ICourse } from '../../../entities/course/course.model';
import TranslateDirective from '../../../shared/language/translate.directive';
import { HtmlUtilService } from '../../../core/util/html-util.service';
import { RouterLink } from '@angular/router';
import { DataUtils } from '../../../core/util/data-util.service';
import { CurriculumMappingService } from '../curriculum-mapping.service';
import { IReport } from '../report.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

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

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  downloadPdf(courseId: number): void {
    this.isdl = true;
    this.curriculumMappingService.find(courseId).subscribe(res => {
      const dto: IReport | null = res.body;
      this.openFile(dto?.binaryData || '', 'application/pdf');
      this.isdl = false;
    });
  }
}
