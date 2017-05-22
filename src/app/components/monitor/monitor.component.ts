import { Component, OnInit } from '@angular/core';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  public ventanillas;


  constructor(private VentanillasService: VentanillasService, private TurnosService: TurnosService) { }

  ngOnInit() {
    // buscamos ventanillas disponibles
    this.VentanillasService.get({disponible: true}).subscribe(ventanillas => {
      this.ventanillas = ventanillas;

      // buscamos los turneros que están en uso
      this.TurnosService.get({ultimoEstado: 'uso'}).subscribe(turnos => {

        // buscamos el ultimo numero que haya llamado una ventanilla
        // para un turnero

        this.ventanillas.forEach(ventanilla => {
          if (typeof ventanilla.turno === 'undefined') {
            ventanilla.turno = {};
          }

          turnos.forEach(turno => {
            this.TurnosService.getActual(turno._id, ventanilla._id).subscribe(actual => {

              if (actual && actual[0]) {
                  if (typeof ventanilla.turno._id === 'undefined') {
                    ventanilla.turno = actual[0];
                  }else {
                    const dateCargado = new Date(ventanilla.turno.numeros.estado.fecha);
                    const dateActual = new Date(actual[0].numeros.estado.fecha);

                    if (dateActual > dateCargado) {
                      ventanilla.turno = actual;
                    }
                }
              }

            });

          });
          // console.log(ventanilla.turno.length);
        });


      });
    });
  }

}
