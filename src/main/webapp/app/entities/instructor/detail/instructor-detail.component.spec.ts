import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InstructorDetailComponent } from './instructor-detail.component';

describe('Instructor Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InstructorDetailComponent,
              resolve: { instructor: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InstructorDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load instructor on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InstructorDetailComponent);

      // THEN
      expect(instance.instructor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
