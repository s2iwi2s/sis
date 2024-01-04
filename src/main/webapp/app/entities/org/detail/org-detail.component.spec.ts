import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrgDetailComponent } from './org-detail.component';

describe('Org Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: OrgDetailComponent,
              resolve: { org: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(OrgDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load org on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OrgDetailComponent);

      // THEN
      expect(instance.org).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
