import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jibu',
  templateUrl: './jibu.page.html',
  styleUrls: ['./jibu.page.scss']
})
export class JibuPage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('JibuPage loaded');
  }

}
