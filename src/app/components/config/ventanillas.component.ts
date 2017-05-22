import { Observable, Subject } from 'rxjs/Rx';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';
declare var EventSource: any;
@Component({
    selector: 'app-ventanillas',
    templateUrl: 'ventanillas.html'
})
export class ListaVentanillasComponent implements OnInit {

    private ventanillasSeleccionadas: any = [];
    private ventanillaSeleccionada: any = [];
    private ventanillas: any;
    private showEditarVentanillaPanel = false;
    private mensajesServidor: any = {};
    private servidorCaido = false;
    ws: any;
    previo: any;

    private EVENT_URL = 'http://localhost:1337/api/update';
    private message: String = '0';

    constructor(private VentanillasService: VentanillasService, private TurnosService: TurnosService,
        private router: Router, private route: ActivatedRoute, private changeDetector: ChangeDetectorRef) { }

    ngOnInit() {

        // Creates event object
        this.ws = new EventSource(this.EVENT_URL, { withCredentials: false });

        // Listing to server messages
        // this.ws.onmessage = (evt) => {

        //     // Update the model
        //     this.mensajesServidor = JSON.parse(evt.data);

        //     if (this.mensajesServidor.result !== this.previo) {
        //         alert('cambió el servidor!')
        //     } else {
        //         this.previo = this.mensajesServidor.result;
        //     }

        //     // Manually detect changes
        //     this.changeDetector.detectChanges();

        // };

        this.inicializarVentanillas();
    }

    inicializarVentanillas() {
        this.VentanillasService.get({}).subscribe(ventanillas => {

            if (ventanillas.length) {
                this.ventanillas = ventanillas;
            } else {
                this.ventanillas = [];
            }

        }, error => {

            this.ventanillas = [];
            this.servidorCaido = true;

        });
    }

    estaSeleccionada(ventanilla: any) {
        return this.ventanillas.find(x => x.id === ventanilla._id);
    }

    seleccionarVentanilla(ventanilla) {
        let index;
        if (this.estaSeleccionada(ventanilla)) {
            index = this.ventanillasSeleccionadas.indexOf(ventanilla);
            this.ventanillasSeleccionadas.splice(index, 1);
            this.ventanillasSeleccionadas = [...this.ventanillasSeleccionadas];
        } else {
            this.ventanillasSeleccionadas = [...this.ventanillasSeleccionadas, ventanilla];
        }

        this.ventanillaSeleccionada = ventanilla;
        this.showEditarVentanillaPanel = true;
    }

    agregarVentanilla() {
        this.ventanillaSeleccionada = {};
        this.showEditarVentanillaPanel = true;
        this.inicializarVentanillas();
    }

    onCloseEmit() {
        this.showEditarVentanillaPanel = false;
        this.inicializarVentanillas();
    }

    onEditEmit() {
        this.showEditarVentanillaPanel = false;
        this.inicializarVentanillas();
    }

    /* Actualizar estados de la ventanilla */
    actualizarVentanilla(ventanilla, key, value) {
        const patch = {
            key: key,
            value: value
        };
        this.VentanillasService.patch(ventanilla._id, patch).subscribe(v => {
            this.inicializarVentanillas();
        });
    }

    eliminarVentanilla(ventanilla: any) {
        if (confirm('¿Eliminar Ventanilla?')) {
            this.VentanillasService.delete(ventanilla._id).subscribe(v => {
                this.inicializarVentanillas();
            });
        }
    }


}
