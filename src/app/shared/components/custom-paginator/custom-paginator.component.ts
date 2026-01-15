import {
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  Output,
  signal
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { finalize, Observable } from 'rxjs';
import { PaginateOptionsEnum } from '@app/shared/enum';
import { PageEvent } from '@angular/material/paginator';




@Component({
  selector: 'lib-custom-paginator',
  standalone: true,
  imports: [MatIcon, MatSelectModule, FormsModule, MatTooltip],
  templateUrl: './custom-paginator.component.html',
  styleUrl: './custom-paginator.component.scss'
})
export class CustomPaginatorComponent {
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = PaginateOptionsEnum.PAGE_SIZE;
  @Input() pageSizeOptions = PaginateOptionsEnum.PAGE_SIZE_OPTIONS;
  @Input() showFirstLastButtons!: boolean;
  @Input() ariaLabel!: string;
  @Input() formFieldAppearance!: string;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('totalRegisterCount') totalRegisterCount$!: Observable<number>;

  @Output() page = new EventEmitter<PageEvent>();
  @Output() showMany = new EventEmitter<boolean>(true);

  /**
   * Controla a exibição do botão de mostrar mais registros
   */
  hasShowMany = model<boolean>(false);

  totalCounter = signal(0);

  get canGoToLastPage(): boolean {
    return this.totalCounter() > 0 && this.showMoreCount && !this.isLastPage;
  }

 //private loadingService = inject(LoadingService);

  goToPage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.page.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }

  onPageChange(pageSize: number) {
    this.pageSize = pageSize;
    this.page.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCounter() / this.pageSize);
  }

  firstPage() {
    this.goToPage(0);
  }

  showCountPages() {
    this.hasShowMany.set(true);
    //this.loadingService.start();
    // this.totalRegisterCount$
    //   .pipe(finalize(() => this.loadingService.stop()))
    //   .subscribe((total) => this.totalCounter.set(total));
  }

  get startsFrom(): number {
    return this.pageIndex * this.pageSize + 1;
  }

  get endsAt(): number {
    return Math.min(this.startsFrom + this.length - 1);
  }

  get showMoreCount(): boolean {
    return this.length >= this.pageSize;
  }

  get isLastPage(): boolean {
    return this.pageIndex === this.totalPages - 1;
  }

  get hasShowCounter(): boolean {
    return (
      !this.hasShowMany() &&
      this.endsAt > this.totalCounter() &&
      this.pageSize <= this.length
    );
  }
}
