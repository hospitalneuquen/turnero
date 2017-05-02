import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';

@Component({
  selector: 'app-ventanilla',
  templateUrl: './ventanilla.component.html',
  styleUrls: ['./ventanilla.component.css']
})
export class VentanillaComponent implements OnInit {

  private slug;
  // private ventanilla: IVentanillas;
  private ventanilla: any;
  private prioritario: any;
  private noPrioritario: any;
  private turnoActualPrioritario: any;
  private turnoActualNoPrioritario: any;

  constructor(private VentanillasService: VentanillasService, private TurnosService: TurnosService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      // obtenemos el parametro del nombre de la ventanilla enviado
      this.slug = params['slug'];

      this.inicializarVentanilla();

    });
  }

  inicializarVentanilla() {
    this.VentanillasService.get({ 'nombre': this.slug }).subscribe(ventanilla => {

      if (ventanilla[0]) {
        this.ventanilla = ventanilla[0];

        this.inicializarTurneros();

      } else {
        alert('ventanilla no encontrada');
      }

    });
  }

  inicializarTurneros() {
    // obtenemos prioritario
      this.TurnosService.get({ 'tipo': 'prioritario' }).subscribe(turnos => {

        if (turnos[0]) {
          this.prioritario = turnos[0];

          this.TurnosService.getActual(this.prioritario._id, this.ventanilla._id).subscribe(actual => {
            console.log(actual);
            console.log('ACTUAL::::::::::::::::::::::');
            this.turnoActualPrioritario = actual[0];

            console.log(this.turnoActualPrioritario);
          });

        }
      });

      // obtenemos no prioritario
      this.TurnosService.get({ 'tipo': 'no-prioritario' }).subscribe(turnos => {
        if (turnos[0]) {
          this.noPrioritario = turnos[0];

          this.TurnosService.getActual(this.noPrioritario._id, this.ventanilla._id).subscribe(actual => {
            this.turnoActualNoPrioritario = actual[0];
          });

        }
      });
  }

  /* Pausar ventanilla */
  pausar() {
    const params = { disponible: false };

    this.updateVentanilla(params);

    this.inicializarVentanilla();
  }

  /* Reanudar ventanilla */
  reanudar() {
    const params = { disponible: true };

    this.updateVentanilla(params);
  }

  /* Actualizar la ventanilla */
  updateVentanilla(params: any) {
    this.VentanillasService.put(this.ventanilla._id, params).subscribe(ventanilla => {
      this.ventanilla = ventanilla;
    });
  }
}
