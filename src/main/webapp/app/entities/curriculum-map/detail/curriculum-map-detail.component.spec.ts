import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CurriculumMapDetailComponent } from './curriculum-map-detail.component';

describe('CurriculumMap Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumMapDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CurriculumMapDetailComponent,
              resolve: { curriculumMap: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CurriculumMapDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load curriculumMap on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CurriculumMapDetailComponent);

      // THEN
      expect(instance.curriculumMap).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
