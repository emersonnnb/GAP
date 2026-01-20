import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent as MaterialPageEvent, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort as MaterialSort, Sort,} from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionFilterPipe } from '../../directive/action-filter.directive';
import { DynamicAttributesDirective } from '../../directive/dynamic-attributes.directive';
import { DynamicTableColumnDefDirective } from '../../directive/column-template-def.directive';
import { FooterTemplateDefDirective } from '../../directive/footer-template-def.directive';
import { HeaderTemplateDefDirective } from '../../directive/header-template-def.directive';
import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { FormArray } from '@angular/forms';
import { Observable, Subject, takeUntil, filter } from 'rxjs';
import { ActionClickEvent, Actions, Column } from '@app/shared/interfaces';
import { ActionColumnAttr } from '@app/shared/interfaces/action-column-attr';
import { ButtonPositionEnum, ColumnTypeEnum, PaginateOptionsEnum, TitleTypeEnum } from '@app/shared/enums';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-dynamic-table',
  imports: [    
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSortModule,
    DragDropModule,
    ActionFilterPipe,
    DynamicAttributesDirective,
    DynamicTableColumnDefDirective,
    HeaderTemplateDefDirective,
    FooterTemplateDefDirective,
    CustomPaginatorComponent,
    NgTemplateOutlet,
    NgClass
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dynamic-table.html',
  styleUrl: './dynamic-table.scss'
})
export class DynamicTable  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy, OnChanges {

  @ContentChildren(DynamicTableColumnDefDirective)
  columnTemplateDef!: QueryList<DynamicTableColumnDefDirective>;
  @ContentChildren(HeaderTemplateDefDirective)
  headerTemplateDef!: QueryList<HeaderTemplateDefDirective>;
  @ContentChildren(FooterTemplateDefDirective)
  footerTemplateDef!: QueryList<FooterTemplateDefDirective>;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(CustomPaginatorComponent) paginatorEl!: CustomPaginatorComponent;

  /**
   * As colunas a serem exibidas na tabela.
   * @type {Column[]}
   */
  @Input({ required: true }) columns!: Column[];

  /**
   * Se a paginação está ativada para a tabela.
   * @default true
   * @type {boolean}
   */
  @Input() pagination = true;

  /**
   * Se deve exibir a estrutura de paginação
   * @default true
   * @type {boolean}
   */
  @Input() showPaginator = true;

  /**
   * Se deve exibir o cabeçalho da tabela.
   * @default true
   * @type {boolean}
   */
  @Input() header = true;

  /**
   * Se deve habilitar o recurso de seleção para a tabela.
   * @default false
   * @type {boolean}
   */
  @Input() select = false;

  /**
   * Se deve desabilitar o(s) elemento(s) de seleção.
   * @default false
   * @type {boolean}
   */
  @Input() disableSelect = false;

  /**
   * Se deve desabilitar o elemento de seleção no cabeçalho.
   * @default false
   * @type {boolean}
   */
  @Input() disableSelectOnHeader = false;

  /**
   * Se deve exibir o elemento de seleção no cabeçalho.
   * @default false
   * @type {boolean}
   */
  @Input() hideSelectOnHeader = false;

  /**
   * Se deve exibir detalhes expandidos para linhas na tabela.
   * @default false
   * @type {boolean}
   */
  @Input() expandedDetail = false;

  /**
   * Se as linhas de tabela são arrastáveis.
   * @default false
   * @type {boolean}
   */
  @Input() dragabble = false;

  /**
   * A posição do ícone da coluna para obter detalhes expandidos.
   * @type {number}
   */
  @Input() positionColumnIconExpandedDetail!: number;

  /**
   * A variedade de ações a serem exibidas na tabela.
   * @default []
   * @type {Actions[]}
   */
  @Input() actions: Actions[] = [];

  /**
   * Ocultar o menu se as ações matriz estiverem vazias em uma linha específica
   * @default false
   * @type {boolean}
   */
  @Input() hideMenuIfEmpty = false;

  /**
   * Configuração adicional para a coluna de ação.
   * @default null
   * @type {ActionColumnAttr | null}
   */
  @Input() actionColumnAttr: ActionColumnAttr | null = null;

  /**
   * Se deve usar o tema da luz para ações.
   * @default false
   * @type {boolean}
   */
  @Input() actionLightTheme = false;

  /**
   * Atributos adicionais para a coluna do menu em colapso.
   * @default null
   * @optional Isso é opcional e pode ser nulo
   * @type {{ [key: string]: any } | null}
   */
  @Input() menuCollapsedColumnAttr: { [key: string]: any } | null = null;

  /**
   * Se para agrupar ações em um menu.
   * @default true
   * @type {boolean}
   */
  @Input() groupedActions = true;

  /**
   * A matriz de índices de linha a ser exibida na tabela.
   * @default []
   * @type {number[]}
   */
  @Input() rows: any[] = [];

  /**
   * Se as linhas são paginadas.
   * @important Caso seja necessário paginar um endpoint de domínio, defina como `false`
   * @default true
   * @type {boolean}
   */
  @Input() areRowsPaginated = true;

  /**
   * A matriz de linhas selecionadas na tabela.
   * @type {any[]}
   */
  @Input() rowsSelected!: any[];

  /**
   * O número de itens a serem exibidos por página.
   * @default 10
   * @type {number}
   */
  @Input() pageSize = 10;

  /**
   * O número total de elementos na tabela.
   * @default 0
   * @type {number}
   */
  @Input() totalElements = 0;

  /**
   * O índice de página atual da tabela.
   * @default 0
   * @type {number}
   */
  @Input() pageIndex = 0;

  /**
   * O total de registros na tabela.
   * @type {Observable<number>}
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('totalRegisterCount') totalRegisterCount$!: Observable<number>;

  /**
   * Se deve exibir a tabela de adição em linha.
   * @default false
   * @type {boolean}
   */
  @Input() addInLineOpened = false;

  /**
   * Define as opções de quantidade de itens por página que serão exibidas no paginador.
   *
   * Estas opções são utilizadas pelo `MatPaginator` (ou pelo `CustomPaginatorComponent`)
   * para montar o seletor de "itens por página".
   *
   * O valor padrão vem de `PaginateOptionsEnum.PAGE_SIZE_OPTIONS`, que geralmente contém
   * um array numérico, como por exemplo: `[5, 10, 20, 50, 100]`.
   *
   * Exemplo de uso:
   * <app-dynamic-table [pageSizeOptions]="[10, 25, 50]"></app-dynamic-table>
   *
   * @default PaginateOptionsEnum.PAGE_SIZE_OPTIONS
   * @type {number[]}
   */
  @Input() pageSizeOptions = PaginateOptionsEnum.PAGE_SIZE_OPTIONS;

  /**
   * Função para determinar se uma linha deve ser expandida.
   * @default (row: any) => true
   * @type {(row: any) => boolean}
   */
  @Input() canExpand: (row: any) => boolean = () => true;

  /**
   * A função que determina se um item pode ser selecionado
   * @default (item: any, selectAll?: boolean) => true
   * @type {(item: any, selectAll?: boolean) => boolean}
   */
  @Input() canSelectFn = (_item: any, _selectAll = false) => true;

  /**
   * A função que determina se um item está desativado.
   * @default (item: any) => false
   * @type {(item: any) => boolean}
   */
  @Input() isDisabledFn = (_item: any) => false;

  /**
   * Propriedade para expandida todas as linhas se for expandida em linha na tabela
   * @default false
   * @type {boolean}
   */
  @Input() expandedAll = false;

  /**
   * FormArray para manipulação de formulários.
   * @type {FormArray}
   */
  @Input() formArray?: FormArray;

  /**
   * Se deve mostrar ações quando todas as linhas estão selecionadas.
   * @default true
   * @type {boolean}
   */
  @Input() showAllSelectedOptions = true;

  /**
   * Evento emitido quando a página muda na tabela.
   * @type {EventEmitter<PageEvent>}
   */
  @Output() pageChange = new EventEmitter<PageEvent>();

  /**
   * Evento emitido quando a ordenação muda na tabela.
   * @type {EventEmitter<Sort>}
   */
  @Output() sortChange = new EventEmitter<Sort>();

  /**
   * Evento emitido quando uma linha é adicionada na tabela.
   * @type {EventEmitter<any>}
   */
  @Output() rowAdded = new EventEmitter<any>();

  /**
   * Evento emitido quando uma ação é clicada na tabela.
   * @type {EventEmitter<ActionClickEvent>}
   */
  @Output() actionClick = new EventEmitter<ActionClickEvent>();

  /**
   * Evento emitido quando a seleção muda na tabela.
   * @type {EventEmitter<SelectionChange<any>>}
   */
  @Output() selectChange = new EventEmitter<SelectionChange<any>>();

  /**
   * Evento emitido quando uma linha é clicada para abrir os detalhes.
   * @type {EventEmitter<any>}
   */
  @Output() rowClickOpenDetail = new EventEmitter<any>();

  /**
   * Evento emitido quando o evento Drop ocorre na tabela.
   * @type {EventEmitter<CdkDragDrop<string[]>>}
   */
  @Output() dropChange = new EventEmitter<CdkDragDrop<string[]>>();

  customPaginatorElement = viewChild(CustomPaginatorComponent);

  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  menuIndex: number | undefined = undefined;
  detailExpanseIndex: number | undefined = undefined;

  displayedColumns!: string[];
  headers!: string[];

  labelAcaoAtualtemListaMenu = 'Fechar';
  rightActions: Actions[] = [];
  bottomActions: Actions[] = [];
  bottomRightActions: Actions[] = [];
  topLeftActions: Actions[] = [];

  columnType = ColumnTypeEnum;
  titleType = TitleTypeEnum;
  template = new Map<string, TemplateRef<any>>();
  headerTemplate = new Map<string, TemplateRef<any>>();
  footerTemplate = new Map<string, TemplateRef<any>>();
  footers: string[] = [];
  ButtonPositionEnum = ButtonPositionEnum;

  PaginateOptionsEnum = PaginateOptionsEnum;

  private unsub$ = new Subject();
  private stopSelectPropagation = false;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.complete();
  }

  ngAfterContentInit(): void {
    for (const template of this.columnTemplateDef) {
      this.template.set(template.name, template.templateRef);
    }
    for (const template of this.headerTemplateDef) {
      this.headerTemplate.set(template.name, template.templateRef);
    }
    for (const template of this.footerTemplateDef) {
      this.footers.push(template.name);
      this.footerTemplate.set(template.name, template.templateRef);
    }
  }

  ngOnInit(): void {
    this.rightActions = this.actions.filter(
      (action) => action.position === ButtonPositionEnum.RIGHT
    );

    this.bottomActions = this.actions.filter(
      (action) => action.position === ButtonPositionEnum.BOTTOM
    );

    this.bottomRightActions = this.actions.filter(
      (action) => action.position === ButtonPositionEnum.BOTTOM_RIGHT
    );

    this.topLeftActions = this.actions.filter(
      (action) => action.position === ButtonPositionEnum.TOP_LEFT
    );

    this.initTable();

    this.selection.changed
      .pipe(
        takeUntil(this.unsub$),
        filter(() => !this.stopSelectPropagation)
      )
      .subscribe((data: SelectionChange<any>) => {
        if (this.hideSelectOnHeader) {
          if (data.added.length > 0) {
            // Criar manualmente o objeto no formato SelectionChange
            const newSelectionChange: SelectionChange<any> = {
              source: this.selection,
              added: [data.added[0]],
              removed: []
            };
            this.selectChange.emit(newSelectionChange);
          }

          if (data.removed.length > 0) {
            // Criar manualmente o objeto no formato SelectionChange
            const newSelectionChange: SelectionChange<any> = {
              source: this.selection,
              added: [],
              removed: [data.removed[0]]
            };
            this.selectChange.emit(newSelectionChange);
          }
        } else {
          this.selectChange.emit(data);
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.initTable();
    }

    if (changes['rows']) {
      const data = changes['rows'].currentValue || [];

      if (this.areRowsPaginated) {
        this.dataSource.data = data;
      } else {
        this._paginarRegistros(data, this.pageIndex, this.pageSize);
      }

      if (this.table) {
        this.updateTable();
      }
    }

    if (
      changes['rowsSelected'] &&
      changes['rowsSelected'].currentValue.length > 0
    ) {
      this.selectRows(changes['rowsSelected'].currentValue);
    }

    if (this.expandedAll && this.dataSource.data.length > 0) {
      this.expandAllRows();
    }
  }

  private _paginarRegistros(rows: any[], pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.dataSource.data = rows.slice(startIndex, endIndex);
    this.totalElements = this.dataSource.data.length;
  }

  selectRow(row: any, event: any) {
    if (!this.selection.isSelected(row)) {
      if (this.canSelectFn(row)) {
        this.selection.select(row);
      } else {
        event.source.checked = false;
      }
    } else {
      this.selection.deselect(row);
    }
  }

  private selectRows(indexes: number[]) {
    this.stopSelectPropagation = true;
    this.selection.clear();
    this.selection.select(
      ...this.rows.filter((_value: any, index: number) =>
        indexes.includes(index)
      )
    );
    this.stopSelectPropagation = false;
  }

  revertSelection(row: any, select = false) {
    this.stopSelectPropagation = true;
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    }
    if (select) {
      this.selection.select(row);
    }
    this.stopSelectPropagation = false;
  }

  private updateTable() {
    this.table.renderRows();
    //this.sort.sortChange.emit();
  }

  getFormControl(index: number, fieldName: string) {
    if (this.formArray) {
      const control = this.formArray.at(index)?.get(fieldName);
      if (control) {
        control.updateValueAndValidity();
        return control;
      }
      return null;
    }
    return null;
  }

  getActionsByPosition(position: ButtonPositionEnum) {
    return this.actions.filter((action) => (action.position = position));
  }

  initTable() {
    this.displayedColumns = this.columns.map((column) => column.name);
    if (this.expandedDetail)
      this.displayedColumns.splice(
        this.positionColumnIconExpandedDetail,
        0,
        'detail'
      );

    if (this.sort) {
      this.sort.sort({
        id: this.displayedColumns[0],
        start: 'asc',
        disableClear: false
      });
    }

    let headers: string[] = [];

    if (this.select) headers = ['select'];
    if (this.dragabble) headers = ['dragabble'];

    headers.push(...this.displayedColumns);

    if (this.rightActions.length > 0) headers.push('actions');

    this.headers = headers;
    this.dataSource.data = this.rows || [];

    if (this.table) {
      this.updateTable();
    }
  }

  onActionClick(element: any, name: string, message?: string) {
    this.actionClick.emit({
      element,
      name,
      message
    });
    this.menuIndex = undefined;
  }

  closeAddInLine() {
    this.addInLineOpened = false;
  }

  addRow() {
    return;
  }

  @HostListener('document:click', ['$event'])
  protected processOutsideClick(event: any) {
    if (!event.target.className.toString().includes('mat-icon')) {
      this.menuIndex = undefined;
    }
  }

  onSortChange(event: MaterialSort) {
    if (event.direction === '') {
      event.direction = 'asc';
    }

    this.sortChange.emit(event);
  }

  onPageChange(event: MaterialPageEvent) {
    if (this.pageSize !== event.pageSize) {
      this.pageSize = event.pageSize;

      if (this.pagination) {
        this.paginatorEl.firstPage();
        if (event.pageIndex > 0) {
          return;
        }
      }
    }

    if (!this.areRowsPaginated) {
      this._paginarRegistros(this.rows, event.pageIndex, event.pageSize);
    }
    this.pageChange.emit(event);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(event: any) {
    // Se `hideSelectOnHeader` estiver ativo, não permitir seleção de todos
    if (this.hideSelectOnHeader) return;

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    if (event.checked === false) {
      this.selection.clear();
      return;
    }

    const selectable = this.dataSource.data.filter((row) =>
      this.canSelectFn(row, true)
    );

    this.selection.select(...selectable);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Desselecione' : 'Selecione'} tudo`;
    }
    return `${
      this.selection.isSelected(row) ? 'Desselecionar' : 'Selecionar'
    } linha`;
  }

  isEllipsisActive(span: any) {
    const e = span;
    return e.offsetWidth < e.scrollWidth;
  }

  formatElipsisTooltip(span: any, element: string) {
    return this.isEllipsisActive(span) ? element : '';
  }

  toggleExpanse(i: number, row: any) {
    if (!this.canExpand(row)) return;

    if (this.detailExpanseIndex === i || this.dataSource.data[i]?._expanded) {
      this.detailExpanseIndex = undefined;
      this.dataSource.data[i]._expanded = false;
      return;
    }

    this.detailExpanseIndex = i;
    this.rowClickOpenDetail.emit(row);
  }

  /**
   * Handles the drop event of a draggable element.
   * Emits the `dropChange` event with the provided `event` object.
   * @param {CdkDragDrop<string[]>} event The drop event object containing information about the drag and drop.
   * @returns {void}
   */
  dropEvent(event: CdkDragDrop<string[]>): void {
    this.dropChange.emit(event);
  }

  expandAllRows() {
    this.dataSource.data.forEach((row) => {
      row._expanded = true;
    });
  }

  /**
   * Get the total number of elements from the paginator.
   */
  getTotalElementsFromPaginator(): void {
    this.customPaginatorElement()?.showCountPages();
  }

}
