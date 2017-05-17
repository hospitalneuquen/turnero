import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';

@Component({
    selector: 'app-ventanillas',
    templateUrl: 'ventanillas.html'
})
export class ListaVentanillasComponent implements OnInit {

    private ventanillasSeleccionadas: any = [];
    private ventanillas: any;
    private showEditarVentanillaPanel = false;

    constructor(private VentanillasService: VentanillasService, private TurnosService: TurnosService,
        private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.inicializarVentanillas();
        });
    }

    inicializarVentanillas() {
        this.VentanillasService.get({}).subscribe(ventanillas => {

            if (ventanillas.length) {
                this.ventanillas = ventanillas;
            } else {
                alert('ventanilla no encontrada');
            }

        });
    }

    estaSeleccionada(ventanilla: any) {
        return this.ventanillas.find(x => x.id === ventanilla._id);
    }

    seleccionarVentanilla(ventanilla) {
        let index;
        if (this.estaSeleccionada(ventanilla)) {
            ventanilla.Color = 'success';
            index = this.ventanillasSeleccionadas.indexOf(ventanilla);
            this.ventanillasSeleccionadas.splice(index, 1);
            this.ventanillasSeleccionadas = [...this.ventanillasSeleccionadas];
        } else {
            this.ventanillasSeleccionadas = [...this.ventanillasSeleccionadas, ventanilla];
        }
    }

    agregarVentanilla() {
        this.showEditarVentanillaPanel = true;
    }

    cerrarPanelEmit() {
        this.showEditarVentanillaPanel = false;
    }

    /* Actualizar estados de la ventanilla */
    actualizarVentanilla(ventanilla, key, value) {
        const patch = {
            key: key,
            value: value
        }
        this.VentanillasService.patch(ventanilla._id, patch).subscribe(v => {
            ventanilla = v;
            this.inicializarVentanillas();
        });
    }



}
