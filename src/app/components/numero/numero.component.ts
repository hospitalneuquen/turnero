import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';

import { TurnosService } from './../../services/turnos.service';
import { ITurnos } from './../../interfaces/ITurnos';

@Component({
    selector: 'app-numero',
    templateUrl: './numero.component.html',
    styleUrls: ['./numero.component.css']
})
export class NumeroComponent implements OnInit {
    // @Input() turno: ITurnos;
    @Input() turnero: any;
    @Input() turno: any; // turno actual
    @Input() ventanilla: any;

    disponibles: Number;
    existeSiguiente: Boolean = true;
    // @Output() evtOutput: EventEmitter<any> = new EventEmitter<any>();

    constructor(private TurnosService: TurnosService) { }

    ngOnInit() {
        this.count();
    }

    count() {
        this.TurnosService.getCount(this.turnero._id).subscribe(turnos => {
            this.disponibles = turnos.count;

            // return this.disponibles;
        });
    }

    rellamar(turno) {
        const dto = {
            accion: 'rellamar',
            idNumero: turno.numeros._id,
            valores: {
                ventanilla: this.ventanilla._id,
                inc: 1
            }
        };

        this.TurnosService.patch(this.turnero._id, dto).subscribe(turno => {
            this.TurnosService.getActual(this.turnero._id, this.ventanilla._id).subscribe(actual => {
                this.turno = actual[0];
            });
            this.turno = turno;
        });
    }

    siguiente() {
        this.TurnosService.getNext(this.turnero._id).subscribe(turno => {

            if (turno[0]) {

                // asignamos el proximo turno como turno actual
                this.turno = turno[0] ? turno[0] : {};

                // creamos el nuevo estado
                const dto = {
                    accion: 'cambio_estado_numero',
                    idNumero: this.turno.numeros._id,
                    valores: {
                        estado: {
                            valor: 'llamado',
                            fecha: new Date()
                        }
                    }
                };

                // la ventanilla se apropia del turno
                this.TurnosService.patch(this.turnero._id, dto).subscribe(turno => {

                    const dto = {
                        accion: 'cambio_ultimo_estado',
                        idNumero: this.turno.numeros._id,
                        valores: {
                            ventanilla: this.ventanilla._id,
                            llamado: 1,
                            ultimoEstado: 'llamado'
                        }
                    };

                    this.TurnosService.patch(this.turnero._id, dto).subscribe(turno => {
                        // actualizamos la cantidad disponibles
                        // this.count();
                        this.TurnosService.getCount(this.turnero._id).subscribe(turnos => {
                            this.disponibles = turnos.count;
                            // return this.disponibles;

                            if (!this.disponibles) {
                                const dto = {
                                    accion: 'turnero_finalizado',
                                    valores: {
                                        estado: {
                                            fecha: new Date(),
                                            valor: 'finalizado'
                                        },
                                        ultimoEstado: 'finalizado'
                                    }
                                };

                                this.TurnosService.patch(this.turnero._id, dto).subscribe(turno => {
                                });

                            }
                        });
                    });
                });

                // });
            } else {
                // no hay turno disponible
            }
        });

        // this.evtOutput.emit(this.turno);
    }
}
