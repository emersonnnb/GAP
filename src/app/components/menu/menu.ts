import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuItem } from '@app/models/menu.model';
import { Gestao } from '../gestao/gestao';
import { Produtos } from '../produtos/produtos';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatButtonModule,
    Produtos,
    Gestao
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {

  selectedMenu: WritableSignal<string> = signal('produtos');
  sidebarCollapsed: WritableSignal<boolean> = signal(false);

  private router = inject(Router);

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'monitoring', link: 'dashboard' },
    { label: 'Produtos', icon: 'lists', link: 'produtos' },
    { label: 'Gestão', icon: 'group', link: 'gestao' },
    { label: 'Financeiro', icon: 'currency_exchange', link: 'financeiro' },
    { label: 'Configuração', icon: 'settings', link: 'configuracao' },
  ];

  selectMenu(link: string) {
    this.selectedMenu.set(link);
    this.router.navigate([link]);
  }

  selectedMenuLabel() {
    const item = this.menuItems.find((m) => m.link === this.selectedMenu());
    return item?.label ?? '';
  }

  toggleSidebar() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }
}

