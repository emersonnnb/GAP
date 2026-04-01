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
  private readonly userAuthService = inject(UserAuthService);
  private readonly router = inject(Router);

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
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as { login: string; password: string };

    this.userService.login(payload).subscribe({
      next: (response) => {
        this.userAuthService.setUserToken(response.token);
        this.router.navigate(['/menu']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
