import { Component, effect, forwardRef, input, model, output, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, AbstractControl, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule, SubscriptSizing } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomSelectStatusClasses } from './models/status-classes.model';
import { MatSelectFilterComponent } from '@devlukaszmichalak/mat-select-filter';

@Component({
  selector: 'lib-custom-select',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSelectFilterComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelect),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomSelect
    }
  ]
})
export class CustomSelect {

  @ViewChild('selectFilterElement', { static: false })
  selectFilterElement!: MatSelectFilterComponent;

  /**
   * Lista de opções para o select
   * @required
   * @type {InputSignal<any[]>}
   */
  options = input.required<any[] | [] | any>();

  /**
   * Tipo do select que será utilizado
   * @required
   * @type {InputSignal<'select'>}
   */
  type = input.required<'select'>();

  /**
   * Título do select
   * @type {InputSignal<string>}
   * @default ''
   */
  label = input<string>('');

  /**
   * Placeholder do select
   * @type {InputSignal<string>}
   * @default 'Pesquisar...'
   */
  placeholder = input<string>('Pesquisar...');

  /**
   * Placeholder do input de filtro
   * @type {InputSignal<string>}
   * @default 'Pesquisar...'
   */
  filterPlaceholder = input<string>('Pesquisar...');

  /**
   * Define se o select é desabilitado
   * @type {InputSignal<boolean>}
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Define a propriedade do value do select
   * @required
   * @type {InputSignal<string>}
   */
  propertyId = input.required<string>();

  /**
   * Define a propriedade do label do select
   * @required
   * @type {InputSignal<string>}
   */
  propertyName = input.required<string>();

  /**
   * Define se o spinner será exibido
   * @type {InputSignal<boolean>}
   * @default false
   */
  showSpinner = input<boolean>(false);

  /**
   * Define se o filtro será exibido
   * @type {InputSignal<boolean>}
   * @default true
   */
  showFilter = input<boolean>(true);

  /**
   * Define se o select é múltiplo
   * @type {InputSignal<boolean>}
   * @default false
   */
  multiple = input<boolean>(false);

  /**
   * Define a descrição do valor nulo
   * @type {InputSignal<string>}
   * @default 'Selecionar'
   */
  nullDescription = input<string>('Selecionar');

  /**
   * Define as cores (status) do select
   * @type {InputSignal<CustomSelectStatusClasses>}
   */
  status = input<CustomSelectStatusClasses>();

  /**
   * Define o tamanho da abertura de opções do select
   * @type {InputSignal<SubscriptSizing>}
   * @default 'dynamic'
   */
  subscriptSizing = input<SubscriptSizing>('dynamic');

  /**
   * Evento de mudança do select
   * @type {OutputSignal<any>}
   * @default undefined
   */
  change = output<any>();

  required = model<boolean>(false);
  filteredList = signal<any[]>([]);

  control = new FormControl();

  constructor() {
    effect(
      () => {
        this.onFilterList(this.options());
      },
      { allowSignalWrites: true }
    );
  }

  onChange!: (valeu: any) => void;
  onTouched!: () => void;

  writeValue(value: any): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = () => {
      this.control.markAsTouched();
      fn();
    };
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  onChangeHandler(event: any): void {
    this.onChange(event);
    this.change.emit(event);
    this.onTouched();
  }

  onFilterList(event: any[]): void {
    this.filteredList.set(event);
  }

  onSelectClose() {
    if (this.selectFilterElement) {
      const control = this.selectFilterElement.searchForm.get('value') as unknown as FormControl<string>;
      control?.setValue('');
    }
    this.filteredList.set(this.options());
  }
  
  

  shouldAddNullOption(): boolean {
    const hasNullOption = this.filteredList()?.some((option) =>
      this.propertyId() === '@'
        ? option === null
        : option[this.propertyId()] === null
    );

    return (
      !this.required() &&
      !this.multiple() &&
      !!this.nullDescription() &&
      !hasNullOption
    );
  }

  openSelectHandler(): void {
    this.onTouched();
    if (this.showFilter()) {
      this.selectFilterElement.input()?.nativeElement.focus();
    }
  }
  

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.errors && control.errors['required']) {
      this.required.set(true);
    } else if (control.hasValidator(Validators.required)) {
      this.required.set(true);
    } else {
      this.required.set(false);
    }

    return control.valid ? null : { invalid: true };
  }

}
