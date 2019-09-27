import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEditPage } from './inventory-edit.page';

describe('InventoryEditPage', () => {
  let component: InventoryEditPage;
  let fixture: ComponentFixture<InventoryEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
