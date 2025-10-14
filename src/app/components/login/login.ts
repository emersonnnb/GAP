import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '@app/services/user';
import { UserAuthService } from '@app/services/user-auth';
import { Router } from '@angular/router';
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
  private userService = inject(UserService);
  private readonly _userAuthService = inject(UserAuthService);
  private readonly _router = inject(Router);

  constructor() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      login: this.fb.control<string | null>(null, [Validators.required]),
      password: this.fb.control<string | null>(null, [Validators.required]),
    });
  }

  toggleHide() {
    this.hide = !this.hide;
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log(this.form.value);
      this.form.markAllAsTouched();
      return;
    }

    console.log('Form Value:', this.form.value);
    this._router.navigate(['/menu']);
    //   const payload = this.form.getRawValue();
    //   console.log('Payload:', payload);
    //   this.userService.login(payload).subscribe({
    //     next: (response) => {
    //       console.log('Login successful:', response);
    //       this._userAuthService.setUserToken(response.token);
    //       this._router.navigate(['/menu']);
    //     },
    //     error: (error) => {
    //       console.error('Login failed:', error);
    //     }
    //   });
  }
}
