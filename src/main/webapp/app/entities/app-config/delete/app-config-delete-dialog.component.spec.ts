jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppConfigService } from '../service/app-config.service';

import { AppConfigDeleteDialogComponent } from './app-config-delete-dialog.component';

describe('AppConfig Management Delete Component', () => {
  let comp: AppConfigDeleteDialogComponent;
  let fixture: ComponentFixture<AppConfigDeleteDialogComponent>;
  let service: AppConfigService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppConfigDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(AppConfigDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AppConfigDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AppConfigService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
