import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dynamicTableFooterDef]',
  standalone: true
})
export class FooterTemplateDefDirective {
  @Input('dynamicTableFooterDef') name!: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
