import {
  Component,
  HostListener,
  OnInit,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuItem } from '@app/models/menu.model';
import { UserAuthService } from '@app/services/user-auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    RouterOutlet,
    MatButtonModule,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  selectedMenu: WritableSignal<string> = signal('dashboard');
  sidebarCollapsed: WritableSignal<boolean> = signal(false);

  private router = inject(Router);
  private userAuthService = inject(UserAuthService);

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'monitoring', link: 'dashboard' },
    { label: 'Produtos', icon: 'lists', link: 'produtos' },
    { label: 'Gestao', icon: 'group', link: 'gestao' },
    { label: 'Financeiro', icon: 'currency_exchange', link: 'financeiro' },
    { label: 'Configuracao', icon: 'settings', link: 'configuracao' },
    { label: 'PDV', icon: 'sell', link: 'vendas' },
  ];

  ngOnInit() {
    this.sidebarCollapsed.set(window.innerWidth <= 768);
    this.syncSelectedMenu(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) =>
        this.syncSelectedMenu((event as NavigationEnd).urlAfterRedirects),
      );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    if (width <= 768) {
      this.sidebarCollapsed.set(true);
    }
  }

  selectMenu(link: string) {
    this.selectedMenu.set(link);
    this.router.navigate(['/', link]);
  }

  selectedMenuLabel() {
    const item = this.menuItems.find((menuItem) => menuItem.link === this.selectedMenu());
    return item?.label ?? '';
  }

  toggleSidebar() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  logout() {
    this.userAuthService.clearSession();
    this.router.navigate(['/login']);
  }

  private syncSelectedMenu(url: string) {
    const currentPath = url.split('?')[0].split('/').filter(Boolean)[0] || 'dashboard';
    this.selectedMenu.set(currentPath);
  }
}
