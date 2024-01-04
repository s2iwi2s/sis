import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StrategiesDetailComponent } from './strategies-detail.component';

describe('Strategies Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategiesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: StrategiesDetailComponent,
              resolve: { strategies: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(StrategiesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load strategies on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StrategiesDetailComponent);

      // THEN
      expect(instance.strategies).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
