import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LearningCompetencyDetailComponent } from './learning-competency-detail.component';

describe('LearningCompetency Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningCompetencyDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: LearningCompetencyDetailComponent,
              resolve: { learningCompetency: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LearningCompetencyDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load learningCompetency on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LearningCompetencyDetailComponent);

      // THEN
      expect(instance.learningCompetency).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
