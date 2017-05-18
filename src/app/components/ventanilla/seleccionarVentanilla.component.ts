import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { IVentanillas } from './../../interfaces/IVentanillas';

@Component({
    selector: 'app-seleccionar-ventanilla',
    templateUrl: './seleccionarVentanilla.component.html'
})
export class SeleccionarVentanillaComponent implements OnInit {

    public ventanillas;


    constructor(private VentanillasService: VentanillasService,
        private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        const ventanillaActual = localStorage.getItem('ventanillaActual');

        if (ventanillaActual) {
            this.router.navigate(['ventanilla/', ventanillaActual]);
        }

        this.VentanillasService.get({}).subscribe(ventanillas => {
            this.ventanillas = ventanillas;
        });


    }

    seleccionar(ventanilla) {
        const patch = {
            key: 'disponible',
            value: false
        };

        this.VentanillasService.patch(ventanilla._id, patch).subscribe(ventanilla => {
            this.router.navigate(['ventanilla/', ventanilla.nombre]);
        });
    }

}
