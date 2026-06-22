import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesUploadDialogComponent } from './resources-upload-dialog.component';

describe('ResourcesUploadDialogComponent', () => {
  let component: ResourcesUploadDialogComponent;
  let fixture: ComponentFixture<ResourcesUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesUploadDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourcesUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
