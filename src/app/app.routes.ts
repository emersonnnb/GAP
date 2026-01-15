import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Menu } from './pages/menu/menu';
import { authGuard } from './guards/auth-guard';
import { RelatorioProduto } from './pages/produtos/relatorio-produto/relatorio-produto';
import { Gestao } from './pages/gestao/gestao';
import { Produtos } from './pages/produtos/produtos';
import { Vendas } from './pages/vendas/vendas';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: Menu,
    //canActivateChild: [authGuard],
    children: [
      {
        path: 'menu',
        component: Menu,
      },
      {
        path: 'dashboard',
        component: RelatorioProduto,
      },
      {
        path: 'produtos',
        component: Produtos,
      },
      {
        path: 'gestao',
        component: Gestao,
      },
      {
        path: 'financeiro',
        component: RelatorioProduto,
      },
      {
        path: 'configuracao',
        component: RelatorioProduto,
      },
      {
        path: 'vendas',
        component: Vendas,       
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
