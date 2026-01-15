import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueProduto } from './estoque-produto';

describe('EstoqueProduto', () => {
  let component: EstoqueProduto;
  let fixture: ComponentFixture<EstoqueProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoqueProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
