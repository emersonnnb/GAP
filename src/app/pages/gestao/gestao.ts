import { Component, inject, signal } from '@angular/core';
import { CustomTabModel } from '@app/models/custom-tab.model';
import { CustomTabs } from '@app/shared/custom-tabs/custom-tabs';
import { UsuarioList } from './usuario/usuario-list/usuario-list';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialog } from './usuario/usuario-dialog/usuario-dialog';
import { ClienteList } from './cliente-gestao/cliente-list/cliente-list';

@Component({
  selector: 'app-gestao',
  imports: [
    CustomTabs, 
    UsuarioList,
    ClienteList
  ],
  templateUrl: './gestao.html',
})
export class Gestao {


  readonly dialog = inject(MatDialog);

  tabs: CustomTabModel[] = [
    {
      key: 'usuarios',
      label: 'Usuários',
      action: { label: 'Cadastrar usuário', icon: 'add' },
    },
    {
      key: 'clientes',
      label: 'Clientes',
      action: { label: 'Cadastrar cliente', icon: 'add' },
    },
    {
      key: 'fornecedores',
      label: 'Fornecedores',
      action: { label: 'Cadastrar fornecedor', icon: 'add' },
    },
  ];

  activeTab = signal('usuarios');

  onTabChange(tabKey: string) {
    this.activeTab.set(tabKey);
    console.log('Tab changed to:', tabKey);
  }

  onActionClick(tabKey: string) {
    console.log('Ação clicada na aba:', tabKey);

    switch (tabKey) {
      case 'usuarios':
        this.openDialog(UsuarioDialog)
        break;
      case 'clientes':
        break;
      case 'fornecedores':
        break;
    }
  }

  openDialog(component: any) {
    const dialogRef = this.dialog.open(component,{
      height: 'auto',
      width: '800px',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('FECHOU O MODAL', result);     
    });  
  }
}
