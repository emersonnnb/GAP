import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';

import { AlertComponent } from '../alert.component';
import { AlertOptions } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private matDialog = inject(MatDialog);

  /**
   * Armazena descrições de erro que estão sendo exibidas (para evitar abrir alertas duplicados).
   * @type {Map<string, MatDialogRef<AlertComponent, boolean>>}
   * @private
   * @memberof AlertService
   */
  private openedErrors = new Map<
    string,
    MatDialogRef<AlertComponent, boolean>
  >();

  /**
   * Filtra alertas de erro vindos de requisições HTTP para evitar spam
   * @type {number}
   * @private
   * @memberof AlertService
   */
  private lastHttpErrorTime = 0;
  private readonly httpErrorCooldown = 3000;

  /**
   * Notifica quando um novo erro é adicionado ao mapa, acionando a limpeza programada
   * com base no tempo `httpErrorCooldown`
   * @type {Subject<void>}
   * @private
   * @memberof AlertService
   */
  private errorAdded$ = new Subject<void>();

  constructor() {
    this.errorAdded$
      .pipe(switchMap(() => timer(this.httpErrorCooldown)))
      .subscribe(() => this.openedErrors.clear());
  }

  /**
   * Exibe um alerta para o usuário
   * @param opts Parametros de configuração do alerta
   * @returns `true` se o usuário clicou em sim e `false` se clicou em não
   */
  alert(opts: AlertOptions): Observable<boolean> {
    const _opts = new AlertOptions(opts);
    const dialogRef = this.matDialog.open(AlertComponent, {
      width: '380px',
      data: _opts,
      panelClass: _opts.panelClass
    });

    return dialogRef.afterClosed();
  }

  /**
   * Exibe um alerta de erro para o usuário
   * @extra O alert de erro verifica se já existe um alerta aberto para a mesma descrição:
   * - Se existir, ele retorna o `afterClosed` do alerta existente
   * - Se não existir, é criado um novo alerta
   *
   * A lista de alertas é limpa após um tempo `httpErrorCooldown` (3s) para evitar spam
   * @param description Descrição do alerta
   * @returns `true` se o usuário clicou no "Ok"
   */
  error(
    description: string,
    source: 'userAction' | 'httpError' = 'userAction'
  ): Observable<boolean> {
    if (source === 'httpError') {
      const now = Date.now();
      if (now - this.lastHttpErrorTime < this.httpErrorCooldown) {
        console.warn(
          'Erro ignorado (múltiplas requisições seguidas):',
          description
        );
        return of(false);
      }
      this.lastHttpErrorTime = now;
    }

    const existingDialogRef = this.openedErrors.get(description);
    if (existingDialogRef) {
      return existingDialogRef
        .afterClosed()
        .pipe(map((result) => result ?? false));
    }

    const dialogRef = this.alert({
      description,
      showNoButton: false,
      showYesButton: true,
      yesButtonText: 'Ok'
    }) as Observable<boolean> & {
      dialogRef?: MatDialogRef<AlertComponent, boolean>;
    };

    const actualRef =
      this.matDialog.openDialogs[this.matDialog.openDialogs.length - 1];
    this.openedErrors.set(description, actualRef);
    this.errorAdded$.next();

    return dialogRef.pipe(
      finalize(() => this.openedErrors.delete(description))
    );
  }
}
