import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';

@Component({
    selector: 'app-panel-ventanilla',
    templateUrl: 'panel-ventanilla.html'
})

export class PanelVentanillaComponent implements OnInit {

    showEditarVentanilla: Boolean = false;

    private _editarVentanilla: any;
    @Input('editarVentanilla')
    set editarVentanilla(value: any) {
        this._editarVentanilla = value;
        this.ventanillaActual = value;
    }
    get editarVentanilla(): any {
        return this._editarVentanilla;
    }

    // @Output() editarVentanillaEmit = new EventEmitter<IVentanillas>();
    @Output() editarVentanillaEmit = new EventEmitter<Boolean>();
    @Output() cerrarPanelEmit = new EventEmitter<Boolean>();
    // @Output() actualizarEstadoEmit = new EventEmitter<boolean>();

    showEditarVentanillaPanel: Boolean = true;

    public ventanillaActual: any = {};

    public alertas: any[] = [];

    constructor(public serviceVentanillas: VentanillasService, public router: Router) {
    }

    ngOnInit() {
        this.ventanillaActual = {
            nombre: '',
            disponible: false,
            prioritaria: false
        };
    }

    guardarVentanilla() {

        if (this.alertas.length === 0) {

            this.serviceVentanillas.post(this.ventanillaActual).subscribe(resultado => {
                this.ventanillaActual = resultado;

                this.showEditarVentanilla = false;

                alert('La Ventanilla se guardó correctamente');
                this.editarVentanillaEmit.emit(true);
            });
        }
    }


    cancelar() {
        this.showEditarVentanillaPanel = false;
        this.cerrarPanelEmit.emit(true);
    }

}
