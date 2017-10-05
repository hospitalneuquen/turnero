import { Component, Input, Output, EventEmitter, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { VentanillasService } from './../../../services/ventanillas.service';
import { TurnosService } from './../../../services/turnos.service';
import { IVentanillas } from './../../../interfaces/IVentanillas';

@Component({
    selector: 'app-panel-ventanilla',
    templateUrl: 'panel-ventanilla.html'
})

export class PanelVentanillaComponent implements OnInit {

    private _editarVentanilla: any;

    public showEditarVentanillaPanel: Boolean = true;
    public ventanillaActual: any = {};
    public alertas: any[] = [];
    public showEditarVentanilla: Boolean = false;

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

    @Input() ventanillas: any;


    constructor(public serviceVentanillas: VentanillasService, 
        public router: Router) {
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
        if (!this.ventanillaActual.numeroVentanilla) {
            this.ventanillaActual.numeroVentanilla = this.ventanillas.length + 1;
        }

    }

    guardarVentanilla(form: any) {

        if (form.valid) {
            const existe = this.ventanillas.find(v => this.ventanillaActual.numeroVentanilla === v.numeroVentanilla);

            if (!this.ventanillaActual._id && typeof existe !== 'undefined') {
                alert('La ventanilla ingresada ya existe');
                return false;
            }

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

                    alert('La Ventanilla se guardó correctamente');
                    this.onEditEmit.emit(true);
                });

            }
        }

    }


    cancelar() {
        this.showEditarVentanillaPanel = false;
        this.onCloseEmit.emit(true);
    }

}
