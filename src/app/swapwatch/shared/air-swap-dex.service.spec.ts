import { TestBed, inject } from '@angular/core/testing';

import { AirSwapDexService } from './air-swap-dex.service';

describe('AirSwapDexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirSwapDexService]
    });
  });

  it('should be created', inject([AirSwapDexService], (service: AirSwapDexService) => {
    expect(service).toBeTruthy();
  }));
});
