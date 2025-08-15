import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jibu',
  standalone: true,
  templateUrl: './jibu.html', // or './jibu.page.html' if that's your file
  styleUrls: ['./jibu.scss'],
  imports: [
    CommonModule, // for *ngIf, *ngFor
    FormsModule,  // for [(ngModel)]
    IonicModule   // for <ion-*> components
  ]
})
export class JibuPage {
  identifier = '';
  password = '';
  rememberMe = false;

  login() {
    console.log('Identifier:', this.identifier);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.rememberMe);
  }
}
