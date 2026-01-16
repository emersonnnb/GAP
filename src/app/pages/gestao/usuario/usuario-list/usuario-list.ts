import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { GestaoUsuarioService } from '@app/pages/gestao/usuario/services/gestao-usuario.service';
import { DynamicTable } from '@app/shared/components/dynamic-table/dynamic-table';
import { CustomSelect } from '@app/shared/custom-select/custom-select';
import {
  ColumnTypeEnum,
  ButtonPositionEnum,
  PaginateOptionsEnum,
} from '@app/shared/enums';
import { FormModeEnum } from '@app/shared/enums/form-mode.enum';
import { Page } from '@app/shared/enums/page.enum';
import { Column, Actions, ActionClickEvent } from '@app/shared/interfaces';
import { SearchButton } from '@app/shared/search-button/search-button';
import { SharedFormsModule } from '@app/shared/sharedForm.module';
import { NgxMaskDirective } from 'ngx-mask';
import { Observable, filter, of, switchMap } from 'rxjs';
import { UsuarioDialog } from '../usuario-dialog/usuario-dialog';
import { AlertService } from '@app/shared/components/alert/services/alert.service';
import {
  AffirmationMessages,
  ConfirmationMessages,
} from '@app/shared/enums/messages.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusEnum, statusMap } from '@app/shared/enums/status.enum';
import { DynamicTableColumnDefDirective } from '@app/shared/directive/column-template-def.directive';
import { TelefoneMaskSemDDI } from '@app/shared/masks/telefone.mask';
import { TelefoneMaskPipe } from '@app/shared/pipes/telefone-mask.pipe';
import { CpfMaskPipe } from '@app/shared/pipes/cpf-mask.pipe';

@Component({
  selector: 'app-usuario-list',
  imports: [
    SharedFormsModule,
    CustomSelect,
    AsyncPipe,
    NgxMaskDirective,
    SearchButton,
    DynamicTable,
    MatSnackBarModule,
    DynamicTableColumnDefDirective,
    TelefoneMaskPipe,
    CpfMaskPipe,
    TitleCasePipe 
  ],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss',
})
export class UsuarioList {
  filter = output();
  clear = output();

  searchForm!: FormGroup;
  searchByList$!: Observable<any[]>;
  selectedSearchField = signal<number | null>(null);
  telefoneMask = TelefoneMaskSemDDI;

  private _fb = inject(FormBuilder);
  private _dialog = inject(MatDialog);
  private _alertService = inject(AlertService);
  private _gestaoUsuarioService = inject(GestaoUsuarioService);
  private _snackBar = inject(MatSnackBar);
  private readonly _destroyRef = inject(DestroyRef);

  private searchOptions = [
    { id: 1, field: 'nome', label: 'Nome' },
    { id: 2, field: 'cpf', label: 'CPF' },
  ];

  columns: Column[] = [
    {
      type: ColumnTypeEnum.SLOT,
      name: 'nome',
      title: 'Nome',
      sortColumn: 'nome',
      headerAttrs: {
        class: 'w-25',
      },
    },
    {
      type: ColumnTypeEnum.SLOT,
      name: 'cpf',
      title: 'CPF',
      sortColumn: 'cpf',
      headerAttrs: {
        class: 'w-25',
      },
    },
    {
      type: ColumnTypeEnum.SLOT,
      name: 'telefone',
      title: 'Contato',
      sortColumn: 'contato',
      headerAttrs: {
        class: 'w-25',
      },
    },
    {
      type: ColumnTypeEnum.DATA,
      name: '_status',
      title: 'Status',
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
    {
      icon: 'add_circle',
      name: FormModeEnum.CADASTRAR,
      tooltip: 'Cadastrar novo usuário',
      label: 'Cadastrar novo usuário',
      iconSet: 'material-symbols-outlined',
      position: ButtonPositionEnum.BOTTOM_RIGHT,
      class: 'text-center',
      conditional: () => this.canCreate,
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

  ngOnInit(): void {
    this.buildSearchForm();
    this.getData();
  }

  getData() {
    this._gestaoUsuarioService.getAllUsers().subscribe((response) => {
      this.rows.set(
        response.map((item) => {
          return {
            ...item,
             _status: statusMap[item.status as StatusEnum] ?? '-'             
          };
        })
      );
    });
  }

  private buildSearchForm(): void {
    this.searchForm = this._fb.group({
      pageStart: this._fb.control<number>(0),
      pageSize: this._fb.control<number>(10),
      pageSort: this._fb.control<string | null>(null),
      pageOrder: this._fb.control<'ASC' | 'DESC'>('ASC'),
      filtroPesquisa: this._fb.control<number | null>(this.searchOptions[0].id),
      nome: this._fb.control<string | null>(null, [
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      cpf: this._fb.control<number | null>(null),
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
    this.getData();
  }

  onSortChange(sort: Sort): void {
    this.currentSort.set(sort);
    this.getData();
  }

  onActionClick(event: ActionClickEvent): void {
    const action = event.name as FormModeEnum;

    if (action === FormModeEnum.REMOVER) {
      this.deleteUser(event.element?.id);
      return;
    }

    const data: any = { mode: action };

    if (action !== FormModeEnum.CADASTRAR) {
      data.id = event.element?.id;
    }

    const dialogRef = this._dialog.open(UsuarioDialog, {
      height: 'auto',
      width: '800px',
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {      
      if (result) {
        this.getData();
      }
    });
  }

  private deleteUser(id: number): void {
    this._alertService
      .alert({
        title: 'Excluir Usuário',
        description: ConfirmationMessages.EXCLUDE_RECORD,
      })
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((result) => result),
        switchMap(() => {
          return this._gestaoUsuarioService.delete(id);
        })
      )
      .subscribe({
        next: () => {
          this._snackBar.open('Usuário Excluido com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.getData();
        },
        error: (error: HttpErrorResponse) => {
          const message =
            error?.error?.message ||            
            AffirmationMessages.SYSTEM_UNAVAILABLE;
          this._alertService.error(message, 'httpError');
        },
      });
  }

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
}
