import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioGestao } from './usuario-gestao';

describe('UsuarioGestao', () => {
  let component: UsuarioGestao;
  let fixture: ComponentFixture<UsuarioGestao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioGestao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioGestao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
