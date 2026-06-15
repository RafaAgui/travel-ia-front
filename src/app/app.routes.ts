import { Routes } from '@angular/router';
import { PlanDetailComponent } from './plan-detail/plan-detail';

export const routes: Routes = [
  {
    path: 'plan-viaje/:id',
    component: PlanDetailComponent,
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
