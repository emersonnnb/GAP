import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioFilter } from './usuario-filter';

describe('UsuarioFilter', () => {
  let component: UsuarioFilter;
  let fixture: ComponentFixture<UsuarioFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
