import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Result3dComponent } from './result3d/result3d.component';
import { History2dComponent } from './history2d/history2d.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'result3d',
    component: Result3dComponent
  },
  {
    path: 'history2d',
    component: History2dComponent
  },
  {
    path: '**', //wildcard route
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
