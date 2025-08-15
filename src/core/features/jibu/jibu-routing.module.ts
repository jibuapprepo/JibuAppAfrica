import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JibuPage } from './jibu.page';

const routes: Routes = [
  {
    path: '',
    component: JibuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JibuPageRoutingModule {}
