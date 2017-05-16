import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public ventanillActual: String = '';
  constructor() { }

  ngOnInit() {
    // this.ventanillActual = JSON.parse(localStorage.getItem('ventanillaActual'));

  }

}
