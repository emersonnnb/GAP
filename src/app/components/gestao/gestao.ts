import { Component, signal } from '@angular/core';
import { CustomTabModel } from '@app/models/custom-tab.model';
import { CustomTabs } from '@app/shared/custom-tabs/custom-tabs';
import { UsuarioGestao } from './usuario-gestao/usuario-gestao';

@Component({
  selector: 'app-gestao',
  imports: [
    CustomTabs,
    UsuarioGestao
  ],
  templateUrl: './gestao.html'  
})
export class Gestao {
 
  tabs: CustomTabModel[] = [    
    { key: 'usuarios', label: 'Usuários', action: { label: 'Cadastrar usuário', icon: 'add' } },
    { key: 'clientes', label: 'Clientes', action: { label: 'Cadastrar cliente', icon: 'add' }  },
    { key: 'fornecedores', label: 'Fornecedores' , action: { label: 'Cadastrar fornecedor', icon: 'add' }   }
  ];

  activeTab = signal('usuarios');

  onTabChange(tabKey: string) {
    this.activeTab.set(tabKey);
    console.log('Tab changed to:', tabKey);
  }

  onActionClick(tabKey: string) {
    console.log('Ação clicada na aba:', tabKey);    
  }
}
