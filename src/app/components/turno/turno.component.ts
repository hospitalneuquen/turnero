import { VentanillasService } from './../../services/ventanillas.service';
import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';

import { TurnosService } from './../../services/turnos.service';
import { ITurnos } from './../../interfaces/ITurnos';

@Component({
    selector: 'app-turno',
    templateUrl: './turno.component.html',
    styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {

    @Input() turno: any; // turno actual
    @Input() ventanilla: any;

    disponibles: Number;
    existeSiguiente: Boolean = true;
    ultimoTurnoLlamado: any;

    constructor(private TurnosService: TurnosService, private VentanillasService: VentanillasService) { }

    ngOnInit() {
    }

    count() {
        this.TurnosService.getCount(this.turno._id).subscribe(turnos => {
            this.disponibles = turnos.count || 0;
        });
    }

    rellamar(turno, tipo) {
        let dto = {};

        if (tipo === 'actual') {
            dto = {
                accion: 'rellamar',
                tipo: this.turno.tipo,
                idTurno: this.turno._id
            };

            this.VentanillasService.patch(this.ventanilla._id, dto).subscribe(ventanillaPatch => {
                this.ventanilla = ventanillaPatch;

                this.TurnosService.getActual(this.turno._id).subscribe(actual => {
                    this.turno = actual[0];
                });
            });

        } else if (tipo === 'anterior') {
            this.TurnosService.getPrev(this.turno._id, this.ventanilla._id).subscribe(anterior => {

            });

        }

    }

    siguiente() {
        const dto = {
            accion: 'siguiente',
            tipo: this.turno.tipo,
            idTurno: this.turno._id
        };

        this.VentanillasService.patch(this.ventanilla._id, dto).subscribe(ventanillaPatch => {
            this.ventanilla = ventanillaPatch;

            this.TurnosService.getActual(this.turno._id).subscribe(turno => {
                this.turno = turno[0];
            });
        });

        // this.evtOutput.emit(this.turno);
    }

    /* finalizamos turnero y damos comienzo a uno nuevo */
    proximoTurno() {
        const dto = {
            accion: 'cambiar_turno',
            tipo: this.turno.tipo,
            idTurno: this.turno._id
        };

        this.VentanillasService.patch(this.ventanilla._id, dto).subscribe(ventanillaPatch => {
            this.ventanilla = ventanillaPatch;

            this.TurnosService.get({ tipo: this.turno.tipo, estado: 'activo' }).subscribe(turnero => {
                this.turno = turnero[0];
            });
        });
    }
}
