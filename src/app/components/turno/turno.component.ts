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

    constructor(private TurnosService: TurnosService, private VentanillasService: VentanillasService) { }

    ngOnInit() {
        console.log(this.turno);
        console.log(this.ventanilla);
    }

    count() {
        console.log('this.turno', this.turno);

        this.TurnosService.getCount(this.turno._id).subscribe(turnos => {
            this.disponibles = turnos.count || 0;
        });
    }

    rellamar(turno, tipo) {
        let dto = {};

        if (tipo === 'actual') {
            dto = {
                accion: 'rellamar',
                tipo: this.turno.tipo
            };


            this.VentanillasService.patch(this.ventanilla._id, dto).subscribe(ventanillaPatch => {
                this.TurnosService.getActual(this.turno._id, { tipo: this.turno.tipo }).subscribe(actual => {
                    this.turno = actual[0];
                    console.log(this.turno);

                });
                this.ventanilla = ventanillaPatch;
            });

        } else if (tipo === 'anterior') {
            this.TurnosService.getPrev(this.turno._id, this.ventanilla._id).subscribe(anterior => {
                console.log(anterior);
            });

        }

    }

    siguiente() {
        console.log('this.turno.tipo', this.turno.tipo);

        const dto = {
            accion: 'siguiente',
            tipo: this.turno.tipo
        };
        this.VentanillasService.patch(this.ventanilla._id, dto).subscribe(ventanillaPatch => {
            this.TurnosService.getActual(this.turno._id, { tipo: this.turno.tipo }).subscribe(turno => {

                this.turno = turno[0];
            });
        });

        // this.evtOutput.emit(this.turno);
    }
}
