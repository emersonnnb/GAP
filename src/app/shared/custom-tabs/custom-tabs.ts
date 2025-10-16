import { Component, EventEmitter, Input, Output, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTabModel } from '@app/models/custom-tab.model';


@Component({
  selector: 'lib-custom-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-tabs.html',
  styleUrls: ['./custom-tabs.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomTabs {
  /** Título exibido acima das abas (opcional) */
  @Input() title?: string;

  /** Lista de abas */
  @Input({ required: true }) tabs: CustomTabModel[] = [];

  /** Aba ativa inicial */
  @Input() defaultActive = '';

  /** Evento emitido ao trocar de aba */
  @Output() tabChange = new EventEmitter<string>();

  /** Evento emitido quando o botão de ação é clicado */
  @Output() actionClick = new EventEmitter<string>();

  /** Aba ativa */
  activeTab = signal<string>('');

  ngOnInit() {
    const initial = this.defaultActive || this.tabs[0]?.key || '';
    this.activeTab.set(initial);
  }

  setActiveTab(tabKey: string) {
    this.activeTab.set(tabKey);
    this.tabChange.emit(tabKey);
  }

  onAction(tabKey?: string) {
    if (!tabKey) return; // evita emitir valor inválido
    this.actionClick.emit(tabKey);
  }
  

  /** Retorna a aba ativa */
  get activeTabItem(): CustomTabModel | undefined {
    return this.tabs.find(t => t.key === this.activeTab());
  }
}
