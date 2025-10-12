import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class Login {

  form!: FormGroup;
  hide = true;
  readonly logoPath = 'assets/images/icon_login.png';


  private fb = inject(FormBuilder);

  constructor() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      usuario: [null],
      senha: [null],
    });
  }

  toggleHide() {
    this.hide = !this.hide;
  }
}
