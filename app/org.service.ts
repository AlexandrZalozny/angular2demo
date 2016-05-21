import {Injectable} from 'angular2/core';

import { Org } from './org';
import { OrgResponse } from './org.response';
import {Http, Response, Headers, RequestOptions, URLSearchParams, ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx'; // importing RxJs operators like map


@Injectable() // скобки обязательны

export class OrgService {
    private baseUrl: string = 'http://ang-grid/ang2/ang.php';
    constructor(private _http: Http) { }
    getPage(currentPage, countRec): Observable<OrgResponse> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', currentPage);
        params.set('count_rec', countRec);


        return this._http.get(this.baseUrl, { 'search': params }).map(
            (orgResponse: Response) =>
                orgResponse.json()
        );
    }

    get(id: number): Observable<Org> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id.toString());
        let org = this._http.get(this.baseUrl + '?action=getOne', { 'search': params })
            .map(
            (org: Response) =>
                org.json()
            );
        return org;

    }
    getEmpty(): Org {
        let org: Org = new Org();
        return org;
    }

    save(org: Org): Observable<Org> {
        return this._http.post(this.baseUrl + '?action=save', JSON.stringify(org))
            .map(
            (orgResponse: Response) =>
                orgResponse.json()
            );
    }

    remove(id: number): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id.toString());
        return this._http.delete(this.baseUrl + '?action=remove', { 'search': params })
        .map(
            (orgResponse: Response) =>
                orgResponse.json()
        );
    }
}