import { Component, input, model, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-search-button',
  standalone: true,
  imports: [MatIcon, MatButtonModule, MatTooltip],
  templateUrl: './search-button.html',
  styleUrl: './search-button.scss'
})
export class SearchButton {

  type = input<'submit' | 'button' | 'reset'>('submit');
  form = input.required<FormGroup>();
  searchState = model(false);
  isDirty = model(false);

  clearFn = output();
  searchFn = output();

  private subject$ = new Subject();

  ngOnInit(): void {
    this.form()
      ?.valueChanges?.pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.subject$)
      )
      .subscribe(() => {
        this.isDirty.set(true);
        if (this.searchState()) {
          this.searchState.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.subject$.next(true);
    this.subject$.complete();
  }

  onSearch() {
    if (this.searchState()) {
      this.clearFn.emit();
      this.searchState.set(false);
      this.isDirty.set(false);
    } else if (this.form().valid && this.isDirty()) {
      this.searchFn.emit();
      this.searchState.set(true);
      this.isDirty.set(false);
    }
  }

}
