import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

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

   activeRoute: string;

  constructor(private router: Router, private route: ActivatedRoute,
    location: Location) { 

    router.events.subscribe((val) => {
        if (location.path() !== ''){
          this.activeRoute = location.path();
        }
      });

  }

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
