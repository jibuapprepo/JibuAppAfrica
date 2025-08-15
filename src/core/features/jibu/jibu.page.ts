import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-jibu',
  templateUrl: './jibu.page.html',
  styleUrls: ['./jibu.page.scss']
})
export class JibuPage {
  constructor(private toastCtrl: ToastController) {}

  async showToast() {
    const toast = await this.toastCtrl.create({
      message: 'Hello from Jibu!',
      duration: 2000,
      color: 'primary'
    });
    await toast.present();
  }
}
