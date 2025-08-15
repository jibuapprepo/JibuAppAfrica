import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JibuPage } from './jibu'; // Standalone component

const routes: Routes = [
  {
    path: '',
    component: JibuPage
  }
];

@NgModule({
  imports: [
    JibuPage, // Import standalone page here
    RouterModule.forChild(routes)
  ]
})
export class JibuPageModule {}
