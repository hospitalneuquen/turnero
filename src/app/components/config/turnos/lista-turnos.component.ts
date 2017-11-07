import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import { ITurnos } from './../../../interfaces/ITurnos';
import { TurnosService } from './../../../services/turnos.service';

@Component({
  selector: 'app-lista-turnos',
  templateUrl: './lista-turnos.component.html',
  styleUrls: ['./lista-turnos.component.css']
})
export class ListaTurnosComponent implements OnInit {

  public showEditarTurno: boolean = false;
  public turnoSeleccionado: any;
  public turnos: any[] = [];

  constructor(private turnosService: TurnosService) { }

  ngOnInit() {
    this.inicializarTurnos();
  }

  inicializarTurnos() {
    this.turnosService.get({}).subscribe(turnos => {
      this.turnos = turnos;
    });
  }

  agregarTurno() {
    this.showEditarTurno = true;
    this.turnoSeleccionado = null;
  }

  editarTurno(turno) {
    this.turnoSeleccionado = turno;
    this.showEditarTurno = true;
  }

  delete(turno: any) {
      if (confirm('¿Eliminar turno?')) {
          this.turnosService.delete(turno._id).subscribe(v => {
              this.inicializarTurnos();
          });
      }
    }

  onCloseEmit() {
    this.showEditarTurno = false;
  }

  onEditEmit() {
    this.showEditarTurno = false;
    this.inicializarTurnos();
  }
}
