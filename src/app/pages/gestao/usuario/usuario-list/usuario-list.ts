import { AsyncPipe } from '@angular/common';
import { Component, inject, model, output, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { GestaoUsuarioService } from '@app/services/gestao-usuario.service';
import { DynamicTable } from '@app/shared/components/dynamic-table/dynamic-table';
import { CustomSelect } from '@app/shared/custom-select/custom-select';
import { ColumnTypeEnum, ButtonPositionEnum, PaginateOptionsEnum } from '@app/shared/enums';
import { FormModeEnum } from '@app/shared/enums/form-mode.enum';
import { Page } from '@app/shared/enums/page.enum';
import { Column, Actions, ActionClickEvent } from '@app/shared/interfaces';
import { SearchButton } from '@app/shared/search-button/search-button';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective } from 'ngx-mask';
import { Observable, Subject, of } from 'rxjs';

@Component({
  selector: 'app-usuario-list',
  imports: [
    SharedFormsModule,
    CustomSelect,
    AsyncPipe,
    NgxMaskDirective,
    SearchButton,
    DynamicTable,  
  ],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss'
})
export class UsuarioList {

  filter = output();
  clear = output();

  searchForm!: FormGroup;
  searchByList$!: Observable<any[]>;

  selectedSearchField = signal<number | null>(null);

  private fb = inject(FormBuilder);
  private gestaoUsuarioService = inject(GestaoUsuarioService);

  private destroy$ = new Subject<void>();

  private searchOptions = [
    { id: 1, field: 'nome', label: 'Nome' },
    { id: 2, field: 'cpf', label: 'CPF' },
  ];

  columns: Column[] = [
    {
      type: ColumnTypeEnum.DATA,
      name: 'nome',
      title: 'Nome',
      sortColumn: 'nome',
      headerAttrs: {
        class: 'w-25',
      },
    },
    {
      type: ColumnTypeEnum.DATA,
      name: 'cpf',
      title: 'CPF',
      sortColumn: 'cpf',
      headerAttrs: {
        class: 'w-25',
      },
    },
    {
      type: ColumnTypeEnum.DATA,
      name: 'contato',
      title: 'Contato',
      sortColumn: 'contato',
      headerAttrs: {
        class: 'w-25',
      },
    },
    {
      type: ColumnTypeEnum.DATA,
      name: 'perfil',
      title: 'Perfil',
      sortColumn: 'perfil',
      headerAttrs: {
        class: 'w-20',
      },
    },
  ];
  actions: Actions[] = [
    {
      icon: 'remove_red_eye',
      name: FormModeEnum.VISUALIZAR,
      tooltip: 'Visualizar',
      position: ButtonPositionEnum.RIGHT,
      conditional: () => this.canView,
    },
    {
      icon: 'edit',
      name: FormModeEnum.EDITAR,
      tooltip: 'Editar',
      position: ButtonPositionEnum.RIGHT,
      conditional: () => this.canEdit,
    },
    {
      icon: 'delete',
      name: FormModeEnum.REMOVER,
      tooltip: 'Excluir',
      position: ButtonPositionEnum.RIGHT,
      conditional: () => this.canDelete,
    },
  ];
  rows = model<any[] | []>([]);
  pagination: Page = {
    pageStart: 0,
    pageSize: PaginateOptionsEnum.PAGE_SIZE,
  };
  paginateOptionsEnum = PaginateOptionsEnum;
  currentSort = signal<Sort>({
    active: '',
    direction: '',
  });
    
  get canCreate() {
    return true;
  }

  get canEdit() {
    return true;
  }

  get canView() {
    return true;
  }

  get canDelete() {
    return true;
  }

  ngOnInit(): void {
    this.buildSearchForm();
    this.getData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getData() {
    this.gestaoUsuarioService.getAllUsers().subscribe((response) => {
      this.rows.set(response);
    });
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
        Validators.maxLength(150),
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

  onPageChange(event: PageEvent): void {
    this.pagination.pageStart = event.pageIndex;
    this.pagination.pageSize = event.pageSize;
    //this.loadData();
  }

  onSortChange(sort: Sort): void {
    this.currentSort.set(sort);
    //this.loadData();
  }

  onActionClick(event: ActionClickEvent): void {
    const { name, element } = event;
    const mode = name as FormModeEnum;
  }

}
