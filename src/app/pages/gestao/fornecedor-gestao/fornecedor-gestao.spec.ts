import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorGestao } from './fornecedor-gestao';

describe('FornecedorGestao', () => {
  let component: FornecedorGestao;
  let fixture: ComponentFixture<FornecedorGestao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FornecedorGestao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorGestao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
