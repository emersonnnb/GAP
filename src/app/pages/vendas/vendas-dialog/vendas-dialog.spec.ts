import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasDialog } from './vendas-dialog';

describe('VendasDialog', () => {
  let component: VendasDialog;
  let fixture: ComponentFixture<VendasDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendasDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendasDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
