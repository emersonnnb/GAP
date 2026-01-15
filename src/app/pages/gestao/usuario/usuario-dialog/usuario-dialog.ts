import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CpfMask } from '@app/shared/masks/cpf.mask';
import { TelefoneMaskSemDDI } from '@app/shared/masks/telefone.mask';
import { UtilsService } from '@app/shared/services/utils.service';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    SharedFormsModule,   
    NgxMaskDirective 
  ],
  templateUrl: './usuario-dialog.html',
  styleUrl: './usuario-dialog.scss',
  providers: [provideNgxMask()],
})
export class UsuarioDialog {

  cpfMask = CpfMask
  telefoneMask = TelefoneMaskSemDDI;

  form!: FormGroup;  
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuarioDialog>);

  private readonly dialogData = inject<{
    data: { };
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
        Validators.minLength(3),
        Validators.maxLength(150)
      ]),
      cpf: this.fb.control<string | null>(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(20),
        UtilsService.isValidCpf()
      ]),
      email: this.fb.control<string | null>(null, [
        Validators.required,
        UtilsService.isValidEmail(),
      ]),
      telefone: this.fb.control<string | null>(null, []),      
    });   
  }

  close(): void {
    this.dialogRef.close();
  }

}
