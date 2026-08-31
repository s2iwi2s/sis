import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IGradeLevelPayables } from 'app/entities/grade-level-payables/grade-level-payables.model';
import { GradeLevelPayablesService } from 'app/entities/grade-level-payables/service/grade-level-payables.service';
import { IInvoices } from 'app/entities/invoices/invoices.model';
import { InvoicesService } from 'app/entities/invoices/service/invoices.service';
import { IAccountPayables } from '../account-payables.model';
import { AccountPayablesService } from '../service/account-payables.service';

import { AccountPayablesFormService } from './account-payables-form.service';
import { AccountPayablesUpdate } from './account-payables-update';

describe('AccountPayables Management Update Component', () => {
  let comp: AccountPayablesUpdate;
  let fixture: ComponentFixture<AccountPayablesUpdate>;
  let activatedRoute: ActivatedRoute;
  let accountPayablesFormService: AccountPayablesFormService;
  let accountPayablesService: AccountPayablesService;
  let invoicesService: InvoicesService;
  let gradeLevelPayablesService: GradeLevelPayablesService;

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

    fixture = TestBed.createComponent(AccountPayablesUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountPayablesFormService = TestBed.inject(AccountPayablesFormService);
    accountPayablesService = TestBed.inject(AccountPayablesService);
    invoicesService = TestBed.inject(InvoicesService);
    gradeLevelPayablesService = TestBed.inject(GradeLevelPayablesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Invoices query and add missing value', () => {
      const accountPayables: IAccountPayables = { id: 1994 };
      const invoices: IInvoices = { id: 19997 };
      accountPayables.invoices = invoices;

      const invoicesCollection: IInvoices[] = [{ id: 19997 }];
      vitest.spyOn(invoicesService, 'query').mockReturnValue(of(new HttpResponse({ body: invoicesCollection })));
      const additionalInvoiceses = [invoices];
      const expectedCollection: IInvoices[] = [...additionalInvoiceses, ...invoicesCollection];
      vitest.spyOn(invoicesService, 'addInvoicesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountPayables });
      comp.ngOnInit();

      expect(invoicesService.query).toHaveBeenCalled();
      expect(invoicesService.addInvoicesToCollectionIfMissing).toHaveBeenCalledWith(
        invoicesCollection,
        ...additionalInvoiceses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.invoicesesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call GradeLevelPayables query and add missing value', () => {
      const accountPayables: IAccountPayables = { id: 1994 };
      const gradeLevelPayables: IGradeLevelPayables = { id: 14057 };
      accountPayables.gradeLevelPayables = gradeLevelPayables;

      const gradeLevelPayablesCollection: IGradeLevelPayables[] = [{ id: 14057 }];
      vitest.spyOn(gradeLevelPayablesService, 'query').mockReturnValue(of(new HttpResponse({ body: gradeLevelPayablesCollection })));
      const additionalGradeLevelPayableses = [gradeLevelPayables];
      const expectedCollection: IGradeLevelPayables[] = [...additionalGradeLevelPayableses, ...gradeLevelPayablesCollection];
      vitest.spyOn(gradeLevelPayablesService, 'addGradeLevelPayablesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountPayables });
      comp.ngOnInit();

      expect(gradeLevelPayablesService.query).toHaveBeenCalled();
      expect(gradeLevelPayablesService.addGradeLevelPayablesToCollectionIfMissing).toHaveBeenCalledWith(
        gradeLevelPayablesCollection,
        ...additionalGradeLevelPayableses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.gradeLevelPayablesesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const accountPayables: IAccountPayables = { id: 1994 };
      const invoices: IInvoices = { id: 19997 };
      accountPayables.invoices = invoices;
      const gradeLevelPayables: IGradeLevelPayables = { id: 14057 };
      accountPayables.gradeLevelPayables = gradeLevelPayables;

      activatedRoute.data = of({ accountPayables });
      comp.ngOnInit();

      expect(comp.invoicesesSharedCollection()).toContainEqual(invoices);
      expect(comp.gradeLevelPayablesesSharedCollection()).toContainEqual(gradeLevelPayables);
      expect(comp.accountPayables).toEqual(accountPayables);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAccountPayables>();
      const accountPayables = { id: 21189 };
      vitest.spyOn(accountPayablesFormService, 'getAccountPayables').mockReturnValue(accountPayables);
      vitest.spyOn(accountPayablesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountPayables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(accountPayables);
      saveSubject.complete();

      // THEN
      expect(accountPayablesFormService.getAccountPayables).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountPayablesService.update).toHaveBeenCalledWith(expect.objectContaining(accountPayables));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAccountPayables>();
      const accountPayables = { id: 21189 };
      vitest.spyOn(accountPayablesFormService, 'getAccountPayables').mockReturnValue({ id: null });
      vitest.spyOn(accountPayablesService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountPayables: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(accountPayables);
      saveSubject.complete();

      // THEN
      expect(accountPayablesFormService.getAccountPayables).toHaveBeenCalled();
      expect(accountPayablesService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAccountPayables>();
      const accountPayables = { id: 21189 };
      vitest.spyOn(accountPayablesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountPayables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountPayablesService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareInvoices', () => {
      it('should forward to invoicesService', () => {
        const entity = { id: 19997 };
        const entity2 = { id: 12072 };
        vitest.spyOn(invoicesService, 'compareInvoices');
        comp.compareInvoices(entity, entity2);
        expect(invoicesService.compareInvoices).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGradeLevelPayables', () => {
      it('should forward to gradeLevelPayablesService', () => {
        const entity = { id: 14057 };
        const entity2 = { id: 27978 };
        vitest.spyOn(gradeLevelPayablesService, 'compareGradeLevelPayables');
        comp.compareGradeLevelPayables(entity, entity2);
        expect(gradeLevelPayablesService.compareGradeLevelPayables).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
