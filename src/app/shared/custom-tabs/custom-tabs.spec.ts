import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabs } from './custom-tabs';

describe('CustomTabs', () => {
  let component: CustomTabs;
  let fixture: ComponentFixture<CustomTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
