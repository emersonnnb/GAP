import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dynamicTableColumnDef]',
  standalone: true
})
export class DynamicTableColumnDefDirective {
  @Input('dynamicTableColumnDef') name!: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
