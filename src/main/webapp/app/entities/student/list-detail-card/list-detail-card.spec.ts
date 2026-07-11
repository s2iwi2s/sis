import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailCard } from './list-detail-card';

describe('ListDetailCard', () => {
  let component: ListDetailCard;
  let fixture: ComponentFixture<ListDetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDetailCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDetailCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
