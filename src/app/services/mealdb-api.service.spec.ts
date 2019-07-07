import { TestBed } from '@angular/core/testing';

import { MealdbApiService } from './mealdb-api.service';

describe('MealdbApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MealdbApiService = TestBed.get(MealdbApiService);
    expect(service).toBeTruthy();
  });
});
