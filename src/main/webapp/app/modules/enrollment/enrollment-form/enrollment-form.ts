/* eslint-disable no-console */
import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbAccordionButton,
  NgbAccordionDirective,
  NgbAccordionItem,
  NgbAccordionHeader,
  NgbAccordionToggle,
  NgbAccordionBody,
  NgbAccordionCollapse,
} from '@ng-bootstrap/ng-bootstrap/accordion';

import { AlertError } from 'app/shared/alert/alert-error';
import { SearchCard } from '../search-card/search-card';
import { StudentFormGroup, StudentFormService } from 'app/entities/student/update/student-form.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentDetail } from 'app/entities/student/detail/student-detail';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-enrollment-form',
  imports: [
    AlertError,
    SearchCard,
    FontAwesomeModule,
    StudentDetail,
    NgbAccordionDirective,
    NgbAccordionButton,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionToggle,
    NgbAccordionBody,
    NgbAccordionCollapse,
  ],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.scss',
})
export class EnrollmentForm implements OnInit {
  student: IStudent | null = null;
  hasStudent = false;
  source = 'enroll';

  protected activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      console.log('EnrollmentForm.ngOnInit() called with student:', JSON.stringify(student));
      this.student = student;
      this.hasStudent = !!student;
    });
  }
}
