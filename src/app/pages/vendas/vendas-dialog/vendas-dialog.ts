import { Component, computed, inject, input, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  TypePagamentoEnum,
  typePagamentoMap,
} from '@app/enums/type-pagamento-enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-vendas-dialog',
  standalone: true,
  imports: [ SharedFormsModule, NgxMaskDirective],
  templateUrl: './vendas-dialog.html',
  styleUrl: './vendas-dialog.scss',
})
export class VendasDialog {
  form!: FormGroup;  
  title = 'Pagamento';
  typePagamentoEnum = TypePagamentoEnum;
  readonly metodo = signal<TypePagamentoEnum>(TypePagamentoEnum.DINHEIRO);
  readonly typePagamentoMap = typePagamentoMap;

  private _fb = inject(FormBuilder);
  private readonly dialogData = inject<any>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);

  constructor() {
    this.buildForm();
    this.metodo.set(this.dialogData.typePagamento);
    this.form.patchValue({
      valor: Number(this.dialogData.total ?? 0).toFixed(2) // "59.90"
    });    
    this.form.disable();
    console.log(this.dialogData);
  }

  buildForm() {
    this.form = this._fb.group({
      valor: this._fb.control<number | null>(null, Validators.required),      
    });
  }

  readonly metodoLabel = computed(() => this.typePagamentoMap[this.metodo()]);

  exit(): void {
    // fechar dialog
    this.dialogRef.close();
  }

  confirmarPagamento(): void {
    if (this.form.valid) {
      const formValues = this.form.value;
      console.log('Payload: ', formValues);
    }
  }
}

type ItemCarrinho = {
  produto: Produto;
  qtd: number;
};

type Produto = {
  preco: number;
  // ...demais campos
};
