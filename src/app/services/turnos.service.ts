import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

// import { Server } from '@andes/shared';
import { ITurnos } from './../interfaces/ITurnos';
import { environment } from '../../environments/environment';
// import * as config from '../../../config';

@Injectable()
export class TurnosService {
    constructor(private http: Http) { }

    getDefaultOptions(params) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({
            headers: headers
        });

        // establecemos los parametros de busqueda
        if (params) {
            options.search = new URLSearchParams();
            for (const param in params) {
                if (params[param]) {
                    options.search.set(param, params[param]);
                }
            }
        }

        return options;
    }

    extractData(res: Response) {
        return res.json();
    }

    get(params: any): Observable<ITurnos[]> {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/turnos', options).map(this.extractData);
        // return this.http.get('http://localhost:1337/api/turnos').map(this.extractData);
    }

    getActual(id: any, idVentanilla: any, params: any = null) {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/turnos/' + id + '/ventanilla/' + idVentanilla, options).map(this.extractData);
    }

    /**
    * Metodo getPrev. Trae lista de objetos ventanillas.
    * @param {string} id Id del turnero activo
    * @param {any} params Opciones de busqueda
    */
    getPrev(id: any, idVentanilla: any, params: any = null): Observable<ITurnos> {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/turnos/' + id + '/ventanilla/' + idVentanilla + '/prev', options).map(this.extractData);
    }
    /**
    * Metodo getNext. Trae lista de objetos ventanillas.
    * @param {string} id Id del turnero activo
    * @param {any} params Opciones de busqueda
    */
    getNext(id: any, params: any = null): Observable<ITurnos> {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/turnos/' + id + '/next', options).map(this.extractData);
    }
    /**
    * Metodo getCount. Trae cantidad de turnos disponibles en el turnero
    * @param {string} id Id del turnero activo
    * @param {any} params Opciones de busqueda
    */
    getCount(id: any, params: any = null): Observable<any> {
        const options = this.getDefaultOptions(params);

        return this.http.get(environment.API + '/turnos/' + id + '/count', options).map(this.extractData);
    }

    /**
     * Metodo post. Actualiza un objeto ITurnos.
     * @param {ITurnos} problema Recibe ITurnos
     */
    post(doc: any, params: any = null): Observable<any> {
        const url = '/turnos/';

        const options = this.getDefaultOptions(params);

        return this.http.post(environment.API + url, JSON.stringify(doc), options).map(this.extractData);
    }

    /**
     * Metodo put. Actualiza un objeto ITurnos.
     * @param {ITurnos} problema Recibe ITurnos
     */
    put(id: String, doc: any, params: any = null): Observable<any> {
        const url = '/turnos/' + id;

        const options = this.getDefaultOptions(params);

        return this.http.put(environment.API + url, JSON.stringify(doc), options).map(this.extractData);
    }

    /**
     * Metodo put. Actualiza un objeto ITurnos.
     * @param {ITurnos} problema Recibe ITurnos
     */
    // patchEstadoNumero(id: String, idNumero: String, doc: any, params: any = null): Observable<any> {
    // const url = '/turnos/' + id + '/numero/' + idNumero + '/estado';
    patch(id: String, doc: any, params: any = null): Observable<any> {
        const url = '/turnos/' + id;

        const options = this.getDefaultOptions(params);

        return this.http.patch(environment.API + url, JSON.stringify(doc), options).map(this.extractData);
    }

    delete(id: String, params: any = null): Observable<any> {
        const url = '/turnos/';
        const options = this.getDefaultOptions(params);
        return this.http.delete(environment.API + url + '/' + id, options).map(this.extractData);
    }
}
