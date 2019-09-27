import { TestBed } from '@angular/core/testing';

import { VisionService } from './vision.service';

describe('VisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisionService = TestBed.get(VisionService);
    expect(service).toBeTruthy();
  });
});
