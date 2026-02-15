import { TestBed } from '@angular/core/testing';

import { LaptopService } from './laptop.service';

describe('Laptop', () => {
  let service: LaptopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaptopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
