import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // check variable que almacena el estado del checkbox que abre el menu
  // almacenamos para luego cambiar la propiedad de checked cuando cambio de menu
  public checked: any;

  public ventanillaActual: String = '';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.ventanillaActual = localStorage.getItem('ventanillaActual');
  }

  wasChecked(value) {
    this.checked = value;
  }

  menu(url) {
    this.router.navigate([url]);

    this.wasChecked(false);
  }
}
