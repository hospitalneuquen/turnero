import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-reloj',
  templateUrl: './reloj.component.html',
  styleUrls: ['./reloj.component.css']
})
export class RelojComponent implements OnInit {

  public clock;

  constructor() { }

  ngOnInit() {
    this.clock = Observable
        .interval(1000)
        .map(() => new Date());
  }

}
