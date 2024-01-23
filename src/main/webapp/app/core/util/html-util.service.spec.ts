import { TestBed } from '@angular/core/testing';

import { HtmlUtilService } from './html-util.service';

describe('HtmlUtilService', () => {
  let service: HtmlUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
