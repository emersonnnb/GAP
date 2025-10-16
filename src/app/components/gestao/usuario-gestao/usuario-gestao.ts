import { AsyncPipe } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSelect } from '@app/shared/custom-select/custom-select';
import { SearchButton } from '@app/shared/search-button/search-button';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-usuario-gestao',
  standalone: true,
  imports: [
    SharedFormsModule,
    CustomSelect,
    AsyncPipe,
    NgxMaskDirective,
    SearchButton
  ],
  providers: [provideNgxMask()],
  templateUrl: './usuario-gestao.html',
  styleUrl: './usuario-gestao.scss',
})
export class UsuarioGestao {
  filter = output();
  clear = output();

  searchForm!: FormGroup;
  searchByList$!: Observable<any[]>;

  selectedSearchField = signal<number | null>(null);

  private fb = inject(FormBuilder);

  private destroy$ = new Subject<void>();

  private searchOptions = [    
    { id: 1, field: 'nome', label: 'Nome' },
    { id: 2, field: 'cpf', label: 'CPF' },    
  ];

  ngOnInit(): void {
    this.buildSearchForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildSearchForm(): void {
    this.searchForm = this.fb.group({
      pageStart: this.fb.control<number>(0),
      pageSize: this.fb.control<number>(10),
      pageSort: this.fb.control<string | null>(null),
      pageOrder: this.fb.control<'ASC' | 'DESC'>('ASC'),
      filtroPesquisa: this.fb.control<number | null>(this.searchOptions[0].id),
      nome: this.fb.control<string | null>(null, [
        Validators.minLength(3),
        Validators.maxLength(150)
      ]),
      cpf: this.fb.control<number | null>(null),
    });

    this.selectedSearchField.set(this.searchForm.get('filtroPesquisa')?.value);
    this.searchByList$ = of(this.searchOptions.filter((opt) => opt.id !== 10));

    this.searchForm
      .get('filtroPesquisa')
      ?.valueChanges.subscribe((selectedField: number) => {
        this.onSelectChange(selectedField);
      });
  }

  doSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const form = this.searchForm.value;
    delete form.filtroPesquisa;
    this.filter.emit(this.searchForm.value);
  }

  onSelectChange(selectedField: number) {
    this.selectedSearchField.set(selectedField);
    this.clearUnusedFields();
  }

  doClear() {
    this.clear.emit();
    this.clearForm();
  }

  clearUnusedFields() {
    const selectedField = this.searchForm.get('filtroPesquisa')?.value;

    this.searchOptions.forEach((opt) => {
      if (opt.id !== selectedField) {
        this.searchForm.get(opt.field)?.setValue(null);
      }
    });
  }

  clearForm() {
    this.searchForm.reset();
    this.searchForm.controls['pageStart'].setValue(0);
    this.searchForm.controls['pageSize'].setValue(10);
    this.searchForm.controls['filtroPesquisa'].setValue(
      this.searchOptions[0].id
    );
  }
}
