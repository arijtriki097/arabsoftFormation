import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./employees/employees').then(m => m.EmployeesComponent),
    canActivate: [authGuard]
  },
   {
    path: 'departments',
    loadComponent: () => import('./departements/departements').then(m => m.DepartementsComponent),
    canActivate: [authGuard]
  },
   {
    path: 'regions',
    loadComponent: () => import('./regions/regions').then(m => m.RegionsComponent),
    canActivate: [authGuard]
  },
   {
    path: 'regions/:id',
    loadComponent: () => import('./regions/region-details.component').then(m => m.RegionDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departements/:id',
    loadComponent: () => import('./departements/DepartementDetailsComponent').then(m => m.DepartementDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'protected',
    canActivate: [authGuard],
    loadComponent: () => import('./components/protected/protected.component').then(m => m.ProtectedComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
