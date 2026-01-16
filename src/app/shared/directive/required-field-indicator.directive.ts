import {
  Directive,
  ElementRef,
  inject,
  Renderer2,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { ControlContainer, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[libRequiredIndicator]',
  standalone: true
})
export class RequiredFieldIndicatorDirective implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private container = inject(ControlContainer, { optional: true });

  private sub = new Subscription();
  private labelEl?: HTMLElement;

  ngAfterViewInit(): void {
    this.labelEl = this.host.nativeElement
      .closest('.inline-checkbox')
      ?.querySelector('mat-label') as HTMLElement | undefined;

    if (!this.labelEl) return;

    this.renderer.addClass(this.labelEl, 'lib-marker');

    const ctrl = this.getControl();
    if (!ctrl) return;

    this.sub.add(ctrl.statusChanges.subscribe(() => this.updateClasses(ctrl)));

    queueMicrotask(() => this.updateClasses(ctrl));
  }

  private getControl(): FormControl | null {
    const name = this.host.nativeElement.getAttribute('formControlName');
    if (!name) return null;

    return (this.container?.control?.get(name) as FormControl) ?? null;
  }

  private updateClasses(ctrl: FormControl): void {
    if (!this.labelEl) return;

    this.renderer.removeClass(this.labelEl, 'is-disabled');
    this.renderer.removeClass(this.labelEl, 'is-required');

    if (ctrl.disabled) {
      this.renderer.addClass(this.labelEl, 'is-disabled');
      return;
    }

    const isRequired = ctrl.hasValidator?.(Validators.required) ?? false;
    if (isRequired) this.renderer.addClass(this.labelEl, 'is-required');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
