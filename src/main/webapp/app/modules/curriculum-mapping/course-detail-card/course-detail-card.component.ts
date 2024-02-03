import {Component, Input} from '@angular/core';
import {ICourse} from "../../../entities/course/course.model";
import TranslateDirective from "../../../shared/language/translate.directive";
import {HtmlUtilService} from "../../../core/util/html-util.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'jhi-course-detail-card',
  standalone: true,
  imports: [
    TranslateDirective,
    RouterLink
  ],
  templateUrl: './course-detail-card.component.html'
})
export class CourseDetailCardComponent {
  @Input() selectedCourse: ICourse| null = null;

  constructor(
    protected htmlUtilService: HtmlUtilService) {
  }

}
