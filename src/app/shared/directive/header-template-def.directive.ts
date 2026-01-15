import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dynamicTableHeaderDef]',
  standalone: true
})
export class HeaderTemplateDefDirective {
  @Input('dynamicTableHeaderDef') name!: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
