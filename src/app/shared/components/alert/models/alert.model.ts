export class AlertOptions {
  title?: string = 'Atenção';
  description?: string;
  showYesButton?: boolean = true;
  showNoButton?: boolean = true;
  panelClass?: string = 'modal-wrapper';
  yesButtonText?: string = 'Sim';
  noButtonText?: string = 'Não';

  constructor(opts: AlertOptions) {
    Object.assign(this, opts);
  }
}
