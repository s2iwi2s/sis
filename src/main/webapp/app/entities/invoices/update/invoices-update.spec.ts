import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from 'app/entities/student/student.model';
import { IInvoices } from '../invoices.model';
import { InvoicesService } from '../service/invoices.service';

import { InvoicesFormService } from './invoices-form.service';
import { InvoicesUpdate } from './invoices-update';

describe('Invoices Management Update Component', () => {
  let comp: InvoicesUpdate;
  let fixture: ComponentFixture<InvoicesUpdate>;
  let activatedRoute: ActivatedRoute;
  let invoicesFormService: InvoicesFormService;
  let invoicesService: InvoicesService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(InvoicesUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    invoicesFormService = TestBed.inject(InvoicesFormService);
    invoicesService = TestBed.inject(InvoicesService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Student query and add missing value', () => {
      const invoices: IInvoices = { id: 12072 };
      const student: IStudent = { id: 9978 };
      invoices.student = student;

      const studentCollection: IStudent[] = [{ id: 9978 }];
      vitest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      vitest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ invoices });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.studentsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const invoices: IInvoices = { id: 12072 };
      const student: IStudent = { id: 9978 };
      invoices.student = student;

      activatedRoute.data = of({ invoices });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection()).toContainEqual(student);
      expect(comp.invoices).toEqual(invoices);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IInvoices>();
      const invoices = { id: 19997 };
      vitest.spyOn(invoicesFormService, 'getInvoices').mockReturnValue(invoices);
      vitest.spyOn(invoicesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoices });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(invoices);
      saveSubject.complete();

      // THEN
      expect(invoicesFormService.getInvoices).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(invoicesService.update).toHaveBeenCalledWith(expect.objectContaining(invoices));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IInvoices>();
      const invoices = { id: 19997 };
      vitest.spyOn(invoicesFormService, 'getInvoices').mockReturnValue({ id: null });
      vitest.spyOn(invoicesService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoices: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(invoices);
      saveSubject.complete();

      // THEN
      expect(invoicesFormService.getInvoices).toHaveBeenCalled();
      expect(invoicesService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IInvoices>();
      const invoices = { id: 19997 };
      vitest.spyOn(invoicesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoices });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(invoicesService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStudent', () => {
      it('should forward to studentService', () => {
        const entity = { id: 9978 };
        const entity2 = { id: 22718 };
        vitest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
