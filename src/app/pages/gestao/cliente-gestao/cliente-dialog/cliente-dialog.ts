import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '@app/shared/components/alert/services/alert.service';
import { RequiredFieldIndicatorDirective } from '@app/shared/directive/required-field-indicator.directive';
import { FormModeEnum } from '@app/shared/enums/form-mode.enum';
import { AffirmationMessages } from '@app/shared/enums/messages.enum';
import { StatusEnum } from '@app/shared/enums/status.enum';
import { CpfMask } from '@app/shared/masks/cpf.mask';
import { TelefoneMaskSemDDI } from '@app/shared/masks/telefone.mask';
import { UtilsService } from '@app/shared/services/utils.service';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { UsuarioDialog } from '../../usuario/usuario-dialog/usuario-dialog';
import { CepMask } from '@app/shared/masks/cep.mask';
import { MatTabsModule } from '@angular/material/tabs';
import { Domains } from '@app/services/buscaCep.service';
import { GestaoClienteService } from '../services/gestao-cliente.service';

@Component({
  selector: 'app-cliente-dialog',
  imports: [
    SharedFormsModule,
    NgxMaskDirective,
    MatRadioButton,
    MatRadioModule,
    RequiredFieldIndicatorDirective,
    MatTabsModule,
  ],
  templateUrl: './cliente-dialog.html',
  styleUrl: './cliente-dialog.scss',
  providers: [provideNgxMask()],
})
export class ClienteDialog {
  cpfMask = CpfMask;
  telefoneMask = TelefoneMaskSemDDI;
  cepMask = CepMask;
  statusEnum = StatusEnum;
  mode!: FormModeEnum;
  id!: number;
  form!: FormGroup;
  formModeEnum = FormModeEnum;

  private _fb = inject(FormBuilder);
  private _domains = inject(Domains);
  private _snackBar = inject(MatSnackBar);
  private _alertService = inject(AlertService);
  private _dialogRef = inject(MatDialogRef<UsuarioDialog>);
  private _gestaoClienteService = inject(GestaoClienteService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialogData = inject<{
    id: number;
    mode: FormModeEnum;
  }>(MAT_DIALOG_DATA);

  constructor() {
    this.mode = this._dialogData?.mode;
    this.id = this._dialogData?.id;
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.mode !== FormModeEnum.CADASTRAR) {
      this.getById();
    }
  }

  private buildForm(): void {
    this.form = this._fb.group({
      nome: this._fb.control<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      cpf: this._fb.control<string | null>(null, [
        Validators.minLength(11),
        Validators.maxLength(20),
        UtilsService.isValidCpf(),
      ]),
      dtNascimento: this._fb.control<string | null>(null, [
        Validators.maxLength(10),
      ]),
      email: this._fb.control<string | null>(null, [
        UtilsService.isValidEmail(),
      ]),
      telefone: this._fb.control<string | null>(null, []),
      status: this._fb.control<boolean | null>(null),
      cep: this._fb.control<string | null>(null, []),
      logradouro: this._fb.control<string | null>(null, []),
      bairro: this._fb.control<string | null>(null, []),
      cidade: this._fb.control<string | null>(null, []),
      uf: this._fb.control<string | null>(null, []),
    });

    this.form
      .get('cep')
      ?.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((cep) => {
         if (cep.length === 8){
          this._domains.getCep(cep).subscribe((data) => {
            if (data) {
              this.form.patchValue({
                logradouro: data.street,
                bairro: data.neighborhood,
                cidade: data.city,
                uf: data.state,
              });
            }
          });
         }
      });
  }

  private getById(): void {
    this._gestaoClienteService
      .getById(this.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.form.patchValue(response);

          if (this.mode === FormModeEnum.VISUALIZAR) {
            this.form.disable({ emitEvent: false });
          }
        },
        error: (error: HttpErrorResponse) => {
          const message =
            error?.error?.message || AffirmationMessages.SYSTEM_UNAVAILABLE;

          this._alertService.error(message, 'httpError');
          this._dialogRef.close(false);
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
        ? this._gestaoClienteService.update(this.id, payload)
        : this._gestaoClienteService.create(payload);

    request$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: () => {
        const msg =
          this.mode === FormModeEnum.EDITAR
            ? 'Cliente atualizado com sucesso!'
            : 'Cliente cadastrado com sucesso!';
        this._snackBar.open(msg, 'Fechar', { duration: 3000 });
        this._dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        const message =
          error?.error?.message || AffirmationMessages.SYSTEM_UNAVAILABLE;
        this._alertService.error(message, 'httpError');
      },
    });
  }

  close(): void {
    this._dialogRef.close();
  }
}
