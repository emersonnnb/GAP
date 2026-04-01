import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((module) => module.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/menu/menu').then((module) => module.Menu),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'menu',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/produtos/relatorio-produto/relatorio-produto').then(
            (module) => module.RelatorioProduto
          ),
      },
      {
        path: 'produtos',
        loadComponent: () =>
          import('./pages/produtos/produtos').then((module) => module.Produtos),
      },
      {
        path: 'gestao',
        loadComponent: () =>
          import('./pages/gestao/gestao').then((module) => module.Gestao),
      },
      {
        path: 'financeiro',
        loadComponent: () =>
          import('./pages/produtos/relatorio-produto/relatorio-produto').then(
            (module) => module.RelatorioProduto
          ),
      },
      {
        path: 'configuracao',
        loadComponent: () =>
          import('./pages/produtos/relatorio-produto/relatorio-produto').then(
            (module) => module.RelatorioProduto
          ),
      },
      {
        path: 'vendas',
        loadComponent: () =>
          import('./pages/vendas/vendas').then((module) => module.Vendas),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
