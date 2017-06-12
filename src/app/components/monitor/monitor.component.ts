import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { VentanillasService } from './../../services/ventanillas.service';
import { TurnosService } from './../../services/turnos.service';

declare var EventSource: any;

@Component({
    selector: 'app-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

    public ventanillas;
    private mensajesServidor: any = {};
    private eventSource: any;
    private mensajePrevio: String = '';
    private EVENT_URL = 'http://localhost:1337/api/update';
    // private EVENT_URL = 'http://turnero.hospitalneuquen.org.ar:1337/api/update';
    private ventanillaBlinkId: String = '|';

    public audio = false;

    constructor(
        private VentanillasService: VentanillasService,
        private TurnosService: TurnosService,
        private changeDetector: ChangeDetectorRef) { }

    ngOnInit() {
        this.escucharEventosServidor();
        this.actualizarMonitor();
    }

    actualizarMonitor() {
        // buscamos ventanillas disponibles
        this.VentanillasService.get({ disponible: true }).subscribe(ventanillas => {
            const ventanillasAux: any = ventanillas;

            // buscamos los turneros que están en uso
            this.TurnosService.get({ ultimoEstado: 'uso' }).subscribe(turnos => {

                // buscamos el último número que haya llamado una ventanilla para un turnero
                ventanillasAux.forEach(ventanilla => {
                    if (typeof ventanilla.turno === 'undefined') {
                        ventanilla.turno = {};
                    }

                    turnos.forEach(turno => {
                        // Trae un array de 1 sólo elemento
                        this.TurnosService.getActual(turno._id, ventanilla._id).subscribe(actual => {

                            if (actual && actual[0]) {
                                if (typeof ventanilla.turno._id === 'undefined') {
                                    ventanilla.turno = actual[0];
                                } else {
                                    const dateCargado = new Date(ventanilla.turno.numeros.estado.fecha);
                                    const dateActual = new Date(actual[0].numeros.estado.fecha);

                                    if (dateActual > dateCargado) {
                                        ventanilla.turno = actual[0];
                                    }
                                }
                            }
                        });
                    });
                    this.ventanillas = ventanillas;
                });
            });
        });
    }

    escucharEventosServidor() {
        // Crea un nuevo objeto EventSource que viene de la API
        // Mantiene actualizado el número de turno desde el servidor
        this.eventSource = new EventSource(this.EVENT_URL, { withCredentials: false });

        // Para la oreja a los mensajes de servidor
        this.eventSource.onmessage = (evt) => {

            // Se actualiza el mensaje de servidor
            this.mensajesServidor = JSON.parse(evt.data);

            // Detector de cambios: El último mensaje de la API es diferente al previo?
            if (this.ventanillaBlinkId && this.mensajesServidor.result !== this.ventanillaBlinkId) {
                this.ventanillaBlinkId = '';
                // this.ventanillaBlinkId = this.mensajesServidor.result;
                this.actualizarMonitor();
                this.dingDong();
            } else {
                this.ventanillaBlinkId = this.mensajesServidor.result;
            }

            // Manually detect changes
            this.changeDetector.detectChanges();

        };
    }

    dingDong() {
        this.audio = true;
        setTimeout(() => {
            this.audio = false;
        }, 2000);
    }

}
