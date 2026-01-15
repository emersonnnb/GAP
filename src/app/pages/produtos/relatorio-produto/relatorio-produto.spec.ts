import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatorioProduto } from './relatorio-produto';

describe('RelatorioProduto', () => {
  let component: RelatorioProduto;
  let fixture: ComponentFixture<RelatorioProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
