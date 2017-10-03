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

    @Output() onEditEmit = new EventEmitter<Boolean>();
    @Output() onCloseEmit = new EventEmitter<Boolean>();

    @Input() ventanillasCount: any;

    showEditarVentanillaPanel: Boolean = true;

    public ventanillaActual: any = {};

    public alertas: any[] = [];

    constructor(public serviceVentanillas: VentanillasService, public router: Router) {
    }

    ngOnInit() {

        if (!this.ventanillaActual.disponible) {
            this.ventanillaActual.disponible = false;
        }
        if (!this.ventanillaActual.pausa) {
            this.ventanillaActual.pausa = false;
        }
        if (!this.ventanillaActual.prioritario) {
            this.ventanillaActual.prioritario = false;
        }
        if (!this.ventanillaActual.numero) {
            this.ventanillaActual.numero = this.ventanillasCount + 1;
        }

    }

    guardarVentanilla() {

        this.ventanillaActual.atendiendo = (this.ventanillaActual.atendiendo ? 'prioritario' : 'no-prioritario');

        if (!this.ventanillaActual._id) {
            this.serviceVentanillas.post(this.ventanillaActual).subscribe(resultado => {
                this.ventanillaActual = resultado;

                alert('La Ventanilla se guardó correctamente');
                this.onEditEmit.emit(true);
            });
        } else {
            this.serviceVentanillas.put(this.ventanillaActual._id, this.ventanillaActual).subscribe(resultado => {
                this.ventanillaActual = resultado;

                alert('La Ventanilla se actualizó correctamente');
                this.onEditEmit.emit(true);
            });

        }


    }


    cancelar() {
        this.showEditarVentanillaPanel = false;
        this.onCloseEmit.emit(true);
    }

}
