import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumMappingViewComponent } from './curriculum-mapping-view.component';

describe('CurriculumMappingViewComponent', () => {
  let component: CurriculumMappingViewComponent;
  let fixture: ComponentFixture<CurriculumMappingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumMappingViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumMappingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
