import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IInvoices } from 'app/entities/invoices/invoices.model';
import { InvoicesService } from 'app/entities/invoices/service/invoices.service';
import { IPayments } from '../payments.model';
import { PaymentsService } from '../service/payments.service';

import { PaymentsFormService } from './payments-form.service';
import { PaymentsUpdate } from './payments-update';

describe('Payments Management Update Component', () => {
  let comp: PaymentsUpdate;
  let fixture: ComponentFixture<PaymentsUpdate>;
  let activatedRoute: ActivatedRoute;
  let paymentsFormService: PaymentsFormService;
  let paymentsService: PaymentsService;
  let appConfigService: AppConfigService;
  let invoicesService: InvoicesService;

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

    fixture = TestBed.createComponent(PaymentsUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentsFormService = TestBed.inject(PaymentsFormService);
    paymentsService = TestBed.inject(PaymentsService);
    appConfigService = TestBed.inject(AppConfigService);
    invoicesService = TestBed.inject(InvoicesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call method query and add missing value', () => {
      const payments: IPayments = { id: 26688 };
      const method: IAppConfig = { id: 10896 };
      payments.method = method;

      const methodCollection: IAppConfig[] = [{ id: 10896 }];
      vitest.spyOn(appConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: methodCollection })));
      const expectedCollection: IAppConfig[] = [method, ...methodCollection];
      vitest.spyOn(appConfigService, 'addAppConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payments });
      comp.ngOnInit();

      expect(appConfigService.query).toHaveBeenCalled();
      expect(appConfigService.addAppConfigToCollectionIfMissing).toHaveBeenCalledWith(methodCollection, method);
      expect(comp.methodsCollection()).toEqual(expectedCollection);
    });

    it('should call Invoices query and add missing value', () => {
      const payments: IPayments = { id: 26688 };
      const invoices: IInvoices = { id: 19997 };
      payments.invoices = invoices;

      const invoicesCollection: IInvoices[] = [{ id: 19997 }];
      vitest.spyOn(invoicesService, 'query').mockReturnValue(of(new HttpResponse({ body: invoicesCollection })));
      const additionalInvoiceses = [invoices];
      const expectedCollection: IInvoices[] = [...additionalInvoiceses, ...invoicesCollection];
      vitest.spyOn(invoicesService, 'addInvoicesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payments });
      comp.ngOnInit();

      expect(invoicesService.query).toHaveBeenCalled();
      expect(invoicesService.addInvoicesToCollectionIfMissing).toHaveBeenCalledWith(
        invoicesCollection,
        ...additionalInvoiceses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.invoicesesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const payments: IPayments = { id: 26688 };
      const method: IAppConfig = { id: 10896 };
      payments.method = method;
      const invoices: IInvoices = { id: 19997 };
      payments.invoices = invoices;

      activatedRoute.data = of({ payments });
      comp.ngOnInit();

      expect(comp.methodsCollection()).toContainEqual(method);
      expect(comp.invoicesesSharedCollection()).toContainEqual(invoices);
      expect(comp.payments).toEqual(payments);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPayments>();
      const payments = { id: 15423 };
      vitest.spyOn(paymentsFormService, 'getPayments').mockReturnValue(payments);
      vitest.spyOn(paymentsService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(payments);
      saveSubject.complete();

      // THEN
      expect(paymentsFormService.getPayments).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentsService.update).toHaveBeenCalledWith(expect.objectContaining(payments));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPayments>();
      const payments = { id: 15423 };
      vitest.spyOn(paymentsFormService, 'getPayments').mockReturnValue({ id: null });
      vitest.spyOn(paymentsService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payments: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(payments);
      saveSubject.complete();

      // THEN
      expect(paymentsFormService.getPayments).toHaveBeenCalled();
      expect(paymentsService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IPayments>();
      const payments = { id: 15423 };
      vitest.spyOn(paymentsService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentsService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAppConfig', () => {
      it('should forward to appConfigService', () => {
        const entity = { id: 10896 };
        const entity2 = { id: 7808 };
        vitest.spyOn(appConfigService, 'compareAppConfig');
        comp.compareAppConfig(entity, entity2);
        expect(appConfigService.compareAppConfig).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareInvoices', () => {
      it('should forward to invoicesService', () => {
        const entity = { id: 19997 };
        const entity2 = { id: 12072 };
        vitest.spyOn(invoicesService, 'compareInvoices');
        comp.compareInvoices(entity, entity2);
        expect(invoicesService.compareInvoices).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
