import { Component, signal } from '@angular/core';
import { CustomTabModel } from '@app/models/custom-tab.model';
import { CustomTabs } from '@app/shared/custom-tabs/custom-tabs';

@Component({
  selector: 'app-produtos',
  imports: [CustomTabs],
  templateUrl: './produtos.html',  
})
export class Produtos {
 
  tabs: CustomTabModel[] = [    
    { key: 'catalogos', label: 'Catálogos', action: { label: 'Cadastrar produto', icon: 'add' } },
    { key: 'estoque', label: 'Estoque' },
    { key: 'relatorios', label: 'Relatórios' }
  ];

  activeTab = signal('');

  onTabChange(tabKey: string) {
    this.activeTab.set(tabKey);
    console.log('Tab changed to:', tabKey);
  }

  onActionClick(tabKey: string) {
    console.log('Ação clicada na aba:', tabKey);    
  }
}
