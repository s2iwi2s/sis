import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCard } from './search-card';

describe('SearchCard', () => {
  let component: SearchCard;
  let fixture: ComponentFixture<SearchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
