import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';

import { lastValueFrom, of, throwError } from 'rxjs';

import { PaymentsService } from '../service/payments.service';

import paymentsResolve from './payments-routing-resolve.service';

describe('Payments routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: PaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    vitest.spyOn(mockRouter, 'navigate');
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(PaymentsService);
  });

  describe('resolve', () => {
    it('should return IPayments returned by find', async () => {
      // GIVEN
      service.find = vitest.fn(id => of({ id }));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          paymentsResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).toHaveBeenCalledWith(123);
              expect(result).toEqual({ id: 123 });
              resolve();
            },
          });
        });
      });
    });

    it('should return null if id is not provided', async () => {
      // GIVEN
      service.find = vitest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          paymentsResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).not.toHaveBeenCalled();
              expect(result).toEqual(null);
              resolve();
            },
          });
        });
      });
    });

    it('should route to 404 page if data not found in server', async () => {
      // GIVEN
      vitest.spyOn(service, 'find').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      await TestBed.runInInjectionContext(async () => {
        await expect(lastValueFrom(paymentsResolve(mockActivatedRouteSnapshot))).rejects.toThrow('no elements in sequence');
        // THEN
        expect(service.find).toHaveBeenCalledWith(123);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });

    it('should route to error page if server returns an error other than 404', async () => {
      // GIVEN
      vitest
        .spyOn(service, 'find')
        .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      await TestBed.runInInjectionContext(async () => {
        await expect(lastValueFrom(paymentsResolve(mockActivatedRouteSnapshot))).rejects.toThrow('no elements in sequence');
        // THEN
        expect(service.find).toHaveBeenCalledWith(123);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['error']);
      });
    });
  });
});
