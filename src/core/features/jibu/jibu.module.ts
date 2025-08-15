import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { JibuPage } from './jibu';

const routes: Routes = [
  {
    path: '',
    component: JibuPage
  }
];

@NgModule({
  imports: [
    CommonModule,       // for *ngIf, *ngFor, etc.
    FormsModule,        // for [(ngModel)]
    IonicModule,        // for <ion-*> components
    RouterModule.forChild(routes) // lazy-load route
  ],
  declarations: [
    JibuPage            // declare the component here (non-standalone)
  ]
})
export class JibuPageModule {}
