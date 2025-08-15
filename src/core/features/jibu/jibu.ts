import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'page-jibu',
  templateUrl: 'jibu.html',
  styleUrls: ['jibu.scss']
})
export class JibuPage {

  constructor(private toastCtrl: ToastController) {}

  async showToast() {
    const toast = await this.toastCtrl.create({
      message: 'Hello from Jibu Page!',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

}
