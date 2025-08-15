
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// This route definition will be merged into the main routing when imported in app.module.ts
const routes: Routes = [
  {
    path: 'jibu',
    loadChildren: () =>
      import('src/core/features/jibu/jibu.module').then(m => m.JibuPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JibuRoutingRegistrationModule {}
