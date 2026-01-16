import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { RequiredFieldIndicatorDirective } from '@app/shared/directive/required-field-indicator.directive';
import { StatusEnum } from '@app/shared/enums/status.enum';
import { CpfMask } from '@app/shared/masks/cpf.mask';
import { TelefoneMaskSemDDI } from '@app/shared/masks/telefone.mask';
import { UtilsService } from '@app/shared/services/utils.service';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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

  form!: FormGroup;
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuarioDialog>);

  private readonly dialogData = inject<{
    data: {};
  }>(MAT_DIALOG_DATA);

  constructor() {
    console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.buildForm();
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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = UtilsService.removeNullFields(this.form.getRawValue());
    console.log(formValue);
  }

  close(): void {
    this.dialogRef.close();
  }
}
