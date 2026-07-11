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
import { IStudent, IStudentFilter } from 'app/entities/student/student.model';
import { StudentDetail } from 'app/entities/student/detail/student-detail';
import { ActivatedRoute } from '@angular/router';
import { ApplicationConfigService } from '../../../core/config/application-config.service';

import { Student } from 'app/entities/student/list/student';
import { Alert } from '../../../shared/alert/alert';

@Component({
  selector: 'jhi-enrollment-form',
  imports: [
    AlertError,
    Alert,
    SearchCard,
    FontAwesomeModule,
    StudentDetail,
    Student,
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
  selectedStudent: IStudent | null = null;
  studentFilter: IStudentFilter = {} as IStudentFilter;
  source = 'enroll';

  protected applicationConfigService = inject(ApplicationConfigService);
  protected activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.applicationConfigService.eventEmitter.subscribe(item => this.setSelectedStudent(item.selectedStudent));
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      console.log('EnrollmentForm.ngOnInit() called with student:', JSON.stringify(student));
      this.selectedStudent = student;
    });
  }

  setSelectedStudent(selected: IStudent) {
    this.selectedStudent = selected;
  }

  studentOutputFilterEvent(filter: IStudentFilter): void {
    this.studentFilter = filter;
  }
}
