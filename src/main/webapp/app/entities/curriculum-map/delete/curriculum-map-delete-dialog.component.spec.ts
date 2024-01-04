jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CurriculumMapService } from '../service/curriculum-map.service';

import { CurriculumMapDeleteDialogComponent } from './curriculum-map-delete-dialog.component';

describe('CurriculumMap Management Delete Component', () => {
  let comp: CurriculumMapDeleteDialogComponent;
  let fixture: ComponentFixture<CurriculumMapDeleteDialogComponent>;
  let service: CurriculumMapService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CurriculumMapDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(CurriculumMapDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CurriculumMapDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CurriculumMapService);
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
