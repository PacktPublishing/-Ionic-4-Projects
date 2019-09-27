import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPage } from './meal.page';

describe('MealPage', () => {
  let component: MealPage;
  let fixture: ComponentFixture<MealPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
