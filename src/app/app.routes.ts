import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Menu } from './components/menu/menu';
import { authGuard } from './guards/auth-guard';

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
          // {
          //   path: 'new-product',
          //   component: NewProduct,
          // }
        ],
      },    
      {
        path: '**',
        redirectTo: '/login',
      }
];
