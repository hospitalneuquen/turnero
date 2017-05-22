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

  private numero;
  // private ventanilla: IVentanillas;
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
      this.numero = params['numero'];

      // TODO: si no tenemos numero redireccionamos a la seleccion de ventanilla
      this.inicializarVentanilla();
    });

    // TODO: si no se paso el id nombre de la ventanilla, entonces lo 
    // levantamos de la session e inicializamos la ventanilla
    // var ventanillaActual = JSON.parse(localStorage.getItem('ventanillaActual'));
    // console.log(ventanillaActual);
  }

  inicializarVentanilla() {
    this.VentanillasService.get({ numero: this.numero }).subscribe(ventanilla => {

      if (ventanilla[0]) {
        this.ventanilla = ventanilla[0];

        localStorage.setItem('ventanillaActual', this.ventanilla.numero);

        this.inicializarTurneros();

      } else {
        alert('ventanilla no encontrada');
      }

    });
  }

  inicializarTurneros() {
    // obtenemos prioritario
    this.TurnosService.get({ 'tipo': 'prioritario', 'ultimoEstado': 'uso' }).subscribe(turnos => {
      // TODO: Revisar de enviar limit : 1
      if (turnos[turnos.length - 1]) {
        this.prioritario = turnos[turnos.length - 1];

        this.TurnosService.getActual(this.prioritario._id, this.ventanilla._id).subscribe(actual => {
          this.turnoActualPrioritario = actual[0];

          console.log(this.turnoActualPrioritario);
        });

      }
    });

    // obtenemos no prioritario
    this.TurnosService.get({ 'tipo': 'no-prioritario', 'ultimoEstado': 'uso' }).subscribe(turnos => {
      if (turnos[turnos.length - 1]) {
        this.noPrioritario = turnos[turnos.length - 1];

        this.TurnosService.getActual(this.noPrioritario._id, this.ventanilla._id).subscribe(actual => {
          this.turnoActualNoPrioritario = actual[0];
        });

      }
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
      console.log(v);
    });
  }

  /* Actualizar la ventanilla */
  // updateVentanilla(params: any) {
  //   this.VentanillasService.put(this.ventanilla._id, params).subscribe(ventanilla => {
  //     this.ventanilla = ventanilla;
  //   });
  // }
}
