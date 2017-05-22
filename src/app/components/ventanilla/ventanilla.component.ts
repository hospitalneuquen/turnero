import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';
import { IVentanillas } from './../../interfaces/IVentanillas';
declare var EventSource: any;
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
  private mensajesServidor: any = {};
  private eventSource: any;
  private mensajePrevio: false;

  private EVENT_URL = 'http://localhost:1337/api/update';
  private message: String = '0';

  constructor(private VentanillasService: VentanillasService, private TurnosService: TurnosService,
    private router: Router, private route: ActivatedRoute, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {

    // Crea un nuevo objeto EventSource que viene de la API
    this.eventSource = new EventSource(this.EVENT_URL, { withCredentials: false });

    // Para la oreja a los mensajes de servidor
    this.eventSource.onmessage = (evt) => {

      // Se actualiza el mensaje de servidor
      this.mensajesServidor = JSON.parse(evt.data);

      // let interval = setInterval(() => {

      // }, 2000);

      // Detector de cambios: El último mensaje de la API es diferente al previo?
      if (this.mensajePrevio && this.mensajesServidor.result !== this.mensajePrevio) {
        alert('Cambió el servidor!');
        this.mensajePrevio = false;
        this.inicializarVentanilla();
      } else {
        this.mensajePrevio = this.mensajesServidor.result;
      }

      // Manually detect changes
      this.changeDetector.detectChanges();

    };

    this.route.params.subscribe(params => {
      // obtenemos el parametro del nombre de la ventanilla enviado
      this.slug = params['slug'];

      // TODO: si no tenemos slug redireccionamos a la seleccion de ventanilla
      this.inicializarVentanilla();
    });

    // TODO: si no se paso el id nombre de la ventanilla, entonces lo 
    // levantamos de la session e inicializamos la ventanilla
    // var ventanillaActual = JSON.parse(localStorage.getItem('ventanillaActual'));
    // console.log(ventanillaActual);
  }

  inicializarVentanilla() {
    this.VentanillasService.get({ 'nombre': this.slug }).subscribe(ventanilla => {

      if (ventanilla[0]) {
        this.ventanilla = ventanilla[0];

        localStorage.setItem('ventanillaActual', this.ventanilla.nombre);

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
          console.log(actual);
          console.log('ACTUAL::::::::::::::::::::::');
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
    const params = { pausa: true };

    this.updateVentanilla(params);

    this.inicializarVentanilla();
  }

  /* Reanudar ventanilla */
  reanudar() {
    const params = { pausa: false };
    this.updateVentanilla(params);
  }

  /* Actualizar la ventanilla */
  updateVentanilla(params: any) {
    this.VentanillasService.put(this.ventanilla._id, params).subscribe(ventanilla => {
      this.ventanilla = ventanilla;
    });
  }
}
