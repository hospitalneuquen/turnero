import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public ventanillaActual: String = '';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.ventanillaActual = localStorage.getItem('ventanillaActual');
  }

  menu(url) {
    this.router.navigate([url]);
  }
}
