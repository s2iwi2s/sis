import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';

describe('Student Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: StudentDetailComponent,
              resolve: { student: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(StudentDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load student on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StudentDetailComponent);

      // THEN
      expect(instance.student).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
