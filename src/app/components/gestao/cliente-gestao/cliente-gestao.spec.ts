import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteGestao } from './cliente-gestao';

describe('ClienteGestao', () => {
  let component: ClienteGestao;
  let fixture: ComponentFixture<ClienteGestao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteGestao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteGestao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
