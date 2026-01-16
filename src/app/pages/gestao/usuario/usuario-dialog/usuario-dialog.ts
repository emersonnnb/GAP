import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequiredFieldIndicatorDirective } from '@app/shared/directive/required-field-indicator.directive';
import { StatusEnum } from '@app/shared/enums/status.enum';
import { CpfMask } from '@app/shared/masks/cpf.mask';
import { TelefoneMaskSemDDI } from '@app/shared/masks/telefone.mask';
import { UtilsService } from '@app/shared/services/utils.service';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { GestaoUsuarioService } from '../services/gestao-usuario.service';
import { FormModeEnum } from '@app/shared/enums/form-mode.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { AffirmationMessages } from '@app/shared/enums/messages.enum';
import { AlertService } from '@app/shared/components/alert/services/alert.service';

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    SharedFormsModule,
    NgxMaskDirective,
    MatRadioButton,
    MatRadioModule,
    RequiredFieldIndicatorDirective,
  ],
  standalone: true,
  templateUrl: './usuario-dialog.html',
  styleUrl: './usuario-dialog.scss',
  providers: [provideNgxMask()],
})
export class UsuarioDialog {
  cpfMask = CpfMask;
  telefoneMask = TelefoneMaskSemDDI;
  statusEnum = StatusEnum;
  mode!: FormModeEnum;
  id!: number;
  form!: FormGroup;
  formModeEnum = FormModeEnum;

  private fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private _alertService = inject(AlertService);
  private dialogRef = inject(MatDialogRef<UsuarioDialog>);
  private _gestaoUsuarioService = inject(GestaoUsuarioService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly dialogData = inject<{
    id: number;
    mode: FormModeEnum;
  }>(MAT_DIALOG_DATA);  

  constructor() {
    this.mode = this.dialogData?.mode;
    this.id = this.dialogData?.id;
  }
  
  ngOnInit(): void {
    this.buildForm();
    if (this.mode !== FormModeEnum.CADASTRAR) {
      this.getById();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nome: this.fb.control<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      cpf: this.fb.control<string | null>(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(20),
        UtilsService.isValidCpf(),
      ]),
      email: this.fb.control<string | null>(null, [
        Validators.required,
        UtilsService.isValidEmail(),
      ]),
      telefone: this.fb.control<string | null>(null, []),
      senha: this.fb.control<string | null>(null, []),
      status: this.fb.control<boolean | null>(null, Validators.required),
    });
  }

  private getById(): void {  
    this._gestaoUsuarioService
      .getById(this.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user) => {          
          this.form.patchValue({
            nome: user.nome ?? null,
            cpf: user.cpf ?? null,
            email: (user as any).email ?? null,
            telefone: (user as any).telefone ?? null,
            senha: (user as any).senha ?? null,
            status: user.status ?? null,
          });
  
          if (this.mode === FormModeEnum.VISUALIZAR) {
            this.form.disable({ emitEvent: false });
          }
        },
        error: (error: HttpErrorResponse) => {
          const message =
            error?.error?.message || AffirmationMessages.SYSTEM_UNAVAILABLE;
  
          this._alertService.error(message, 'httpError');
          this.dialogRef.close(false);
        },
      });
  }  

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = UtilsService.removeNullFields(this.form.getRawValue());

    const request$ =
      this.mode === FormModeEnum.EDITAR && this.id
        ? this._gestaoUsuarioService.update(this.id, payload)
        : this._gestaoUsuarioService.create(payload);

    request$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: () => {
        const msg =
          this.mode === FormModeEnum.EDITAR
            ? 'Usuário atualizado com sucesso!'
            : 'Usuário cadastrado com sucesso!';
        this._snackBar.open(msg, 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        const message =
          error?.error?.message || AffirmationMessages.SYSTEM_UNAVAILABLE;
        this._alertService.error(message, 'httpError');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
