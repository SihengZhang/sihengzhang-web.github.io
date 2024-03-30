import { TestBed } from '@angular/core/testing';

import { StockInformationService } from './stock-information.service';

describe('StockInformationService', () => {
  let service: StockInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
