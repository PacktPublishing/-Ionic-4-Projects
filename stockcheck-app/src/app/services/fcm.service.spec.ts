import { TestBed } from '@angular/core/testing';

import { FcmService } from './fcm.service';

describe('FcmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FcmService = TestBed.get(FcmService);
    expect(service).toBeTruthy();
  });
});
