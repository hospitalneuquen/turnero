import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { ITurnos } from './../../../../interfaces/ITurnos';
import { TurnosService } from './../../../../services/turnos.service';

@Component({
  selector: 'app-panel-turno',
  templateUrl: './panel-turno.component.html',
  styleUrls: ['./panel-turno.component.css']
})
export class PanelTurnoComponent implements OnInit, OnDestroy {

  public turnos: any = {};
  public colors: any[] = ['amarillo', 'celeste', 'rosado', 'verde', 'violeta'];


  @Input() turno: any;

  // @Output() evtOutput: EventEmitter<any> = new EventEmitter<any>();

  @Output() onEditEmit = new EventEmitter<Boolean>();
  @Output() onCloseEmit = new EventEmitter<Boolean>();

  constructor(private turnosService: TurnosService) { }

  ngOnInit() {
    this.turnos = (this.turno) ? this.turno : {};
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
          //const error: any = JSON.parse(err._body);

          //console.log(error);
          //console.log(err);
          alert('No se ha podido guardar el turno.');
        }
      });

    }
  }

  cancelar() {
    this.onCloseEmit.emit(true);
  }

  ngOnDestroy() {
    this.turno = null;
  }
}
