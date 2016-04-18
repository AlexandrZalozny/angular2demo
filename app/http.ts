import {Http, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Injectable} from 'angular2/core';
//import {Org} from './org';

@Injectable() // скобки обязательны
export class HttpSample  {

    result: Object;
    combined: any;
    error: Object;
    http: Http;
    orgs: any;
    //postResponse = new Org();

    constructor(http: Http) {

        this.http = http;

    }

   getData(){
        this.orgs = {};
        this.http.get('http://ang-grid/ang.php').toPromise()
        .then((res: Response) => {
            this.org = res.json();
        });
    }

    postData(){

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('http://ang-grid/ang.php?action=save', JSON.stringify({firstName:'Joe',lastName:'Smith'}),{headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res:Person) => this.postResponse = res);
    }
}
