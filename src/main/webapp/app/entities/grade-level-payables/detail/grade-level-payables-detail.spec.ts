import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { GradeLevelPayablesDetail } from './grade-level-payables-detail';

describe('GradeLevelPayables Management Detail Component', () => {
  let comp: GradeLevelPayablesDetail;
  let fixture: ComponentFixture<GradeLevelPayablesDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./grade-level-payables-detail').then(m => m.GradeLevelPayablesDetail),
              resolve: { gradeLevelPayables: () => of({ id: 14057 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    });
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faArrowLeft);
    library.addIcons(faPencilAlt);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeLevelPayablesDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gradeLevelPayables on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GradeLevelPayablesDetail);

      // THEN
      expect(instance.gradeLevelPayables()).toEqual(expect.objectContaining({ id: 14057 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      vitest.spyOn(globalThis.history, 'back');
      comp.previousState();
      expect(globalThis.history.back).toHaveBeenCalled();
    });
  });
});
