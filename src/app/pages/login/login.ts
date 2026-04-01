import { HttpErrorResponse } from '@angular/common/http';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '@app/services/user';
import { UserAuthService } from '@app/services/user-auth';
import { Router } from '@angular/router';
import { AffirmationMessages } from '@app/shared/enums/messages.enum';

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
    MatSnackBarModule,
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
  private readonly snackBar = inject(MatSnackBar);

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
      error: (error: HttpErrorResponse) => {
        const message =
          error?.error?.mensagem ||
          error?.error?.message ||
          AffirmationMessages.SYSTEM_UNAVAILABLE;

        this.snackBar.open(message, 'Fechar', {
          duration: 3000,
        });
        console.error('Login failed:', error);
      },
    });
  }
}
