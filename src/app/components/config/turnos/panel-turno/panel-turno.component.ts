import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ITurnos } from './../../../../interfaces/ITurnos';
import { TurnosService } from './../../../../services/turnos.service';

@Component({
  selector: 'app-panel-turno',
  templateUrl: './panel-turno.component.html',
  styleUrls: ['./panel-turno.component.css']
})
export class PanelTurnoComponent implements OnInit {

  public turnos: any = {};
  public colors: any[] = ['amarillo', 'celeste', 'rosado', 'verde', 'violeta'];


  @Input() turno: any;

  // @Output() evtOutput: EventEmitter<any> = new EventEmitter<any>();

  @Output() onEditEmit = new EventEmitter<Boolean>();
  @Output() onCloseEmit = new EventEmitter<Boolean>();

  constructor(private turnosService: TurnosService) { }

  ngOnInit() {
    if (this.turno) {
      this.turnos = this.turno;
    }
  }

  save(isValid: boolean) {
    if (isValid) {
      let method: any;

      if (!this.turnos._id) {
        method = this.turnosService.post(this.turnos);
      } else {
        method = this.turnosService.put(this.turnos._id, this.turnos);
      }

      method.subscribe(turnos => {
        this.onEditEmit.emit(turnos);
      }, err => {
        if (err) {
          alert('No se ha podido guardar el turno');
        }
      });

    }
  }

  cancelar() {
    this.onCloseEmit.emit(true);
  }
}