import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumMappingDashboardComponent } from './curriculum-mapping-dashboard.component';

describe('CurriculumMappingDashboardComponent', () => {
  let component: CurriculumMappingDashboardComponent;
  let fixture: ComponentFixture<CurriculumMappingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumMappingDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumMappingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
