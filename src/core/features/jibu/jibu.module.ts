import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { JibuPageRoutingModule } from './jibu-routing.module';
import { JibuPage } from './jibu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JibuPageRoutingModule
  ],
  declarations: [JibuPage]
})
export class JibuPageModule {}
