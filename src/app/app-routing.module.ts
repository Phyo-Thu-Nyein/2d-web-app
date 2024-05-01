import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Result3dComponent } from './result3d/result3d.component';
import { History2dComponent } from './history2d/history2d.component';
import { MaintenenceComponent } from './maintenence/maintenence.component';

const routes: Routes = [
  {
    path: '',
    // component: HomeComponent
    component: MaintenenceComponent,
  },
  {
    path: 'result3d',
    // component: Result3dComponent
    component: MaintenenceComponent,
  },
  {
    path: 'history2d',
    // component: History2dComponent
    component: MaintenenceComponent,
  },
  {
    path: '**', //wildcard route
    // component: HomeComponent
    component: MaintenenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
