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

    @Input() turnero: any;
    @Input() turno: any; // turno actual
    @Input() ventanilla: any;

    disponibles: Number;
    existeSiguiente: Boolean = true;

    constructor(private TurnosService: TurnosService, private VentanillasService: VentanillasService) { }

    ngOnInit() {
        console.log(this.turnero);

    }

    count() {
        console.log('this.turnero', this.turnero);

        this.TurnosService.getCount(this.turnero._id).subscribe(turnos => {
            this.disponibles = turnos.count || 0;
        });
    }

    rellamar(turno, tipo) {
        let dto = {};

        if (tipo === 'actual') {
            dto = {
                accion: 'rellamar',
                tipo: this.turnero.tipo
            };


            this.VentanillasService.patch(this.ventanilla._id, dto).subscribe(ventanillaPatch => {
                this.TurnosService.getActual(this.turnero._id, { tipo: this.turnero.tipo }).subscribe(actual => {
                    this.turnero = actual[0];
                    console.log(this.turnero);

                });
                this.ventanilla = ventanillaPatch;
            });

        } else if (tipo === 'anterior') {
            this.TurnosService.getPrev(this.turnero._id, this.ventanilla._id).subscribe(anterior => {
                console.log(anterior);
            });

        }

    }

    siguiente() {
        console.log('this.turnero.tipo', this.turnero.tipo);

        const dto = {
            accion: 'siguiente',
            tipo: this.turnero.tipo
        };
        this.VentanillasService.patch(this.ventanilla._id, dto).subscribe(ventanillaPatch => {
            this.TurnosService.getActual(this.turnero._id, { tipo: this.turnero.tipo }).subscribe(turno => {

                this.turnero = turno[0];
            });
        });

        // this.evtOutput.emit(this.turno);
    }
}
