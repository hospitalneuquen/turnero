import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';
declare var EventSource: any;
@Component({
    selector: 'app-ventanilla',
    templateUrl: './ventanilla.component.html'
})
export class VentanillaComponent implements OnInit {
    sinVentanillas: boolean;

    private numero;
    private ventanilla: any;
    private prioritario: any;
    private noPrioritario: any;
    private turnoActualPrioritario: any;
    private turnoActualNoPrioritario: any;

    constructor(private VentanillasService: VentanillasService, private TurnosService: TurnosService,
        private router: Router, private route: ActivatedRoute) {
        // , private changeDetector: ChangeDetectorRef
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            // obtenemos el parametro del nombre de la ventanilla enviado
            this.numero = (params['numero']) ? params['numero'] : localStorage.getItem('ventanillaActual');

            if (!this.numero) {
                this.router.navigate(['ventanilla']);
            }

            this.inicializarVentanilla();
        });
    }

    inicializarVentanilla() {
        this.VentanillasService.get({ numeroVentanilla: this.numero }).subscribe(ventanilla => {

            if (ventanilla[0]) {
                this.ventanilla = ventanilla[0];


                localStorage.setItem('ventanillaActual', this.ventanilla.numeroVentanilla);

                this.sinVentanillas = false;

                this.inicializarTurneros();

            } else {
                // alert('ventanilla no encontrada');
                this.sinVentanillas = true;
            }

        });
    }

    inicializarTurneros() {

        // obtenemos prioritario
        this.TurnosService.get({ tipo: 'prioritario' }).subscribe(turnero => {
            //this.prioritario = turnero[0];
            this.turnoActualPrioritario = turnero[0];
            console.log(this.turnoActualPrioritario);
            console.log(this.ventanilla);
        });

        // obtenemos no prioritario
        this.TurnosService.get({ tipo: 'no-prioritario' }).subscribe(turnero => {
            //this.noPrioritario = turnero[0];
            this.turnoActualNoPrioritario = turnero[0];
        });
    }

    /* Pausar ventanilla */
    pausar() {
        this.actualizarVentanilla('pausa', true);
        this.inicializarVentanilla();
    }

    /* Reanudar ventanilla */
    reanudar() {
        this.actualizarVentanilla('pausa', false);
        this.inicializarVentanilla();
    }

    /* Actualizar estados de la ventanilla */
    actualizarVentanilla(key, value) {
        const patch = {
            key: key,
            value: value
        };
        this.VentanillasService.patch(this.ventanilla._id, patch).subscribe(v => {
            this.inicializarVentanilla();
        });
    }
}
