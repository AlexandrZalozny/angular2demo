import {Component, ViewChild } from 'angular2/core';
import {UserService} from './user.service';
import {Logger} from './logger';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {Http, Response, Headers, ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

//import {Org} from './org';
//import {HTTP_BINDINGS} from 'angular2/http';

@Component(
    {
        selector: 'app',
        providers: [UserService, Logger, Http, ConnectionBackend, HTTP_PROVIDERS, ModalComponent],
        templateUrl: './app/app.html',
        directives: [MODAL_DIRECTIVES]
    }
)
export class AppComponent {
    greetings: string = 'World';
    //user: User;
    http: Http;
    orgs: Org[] = [];
    @ViewChild('myModal')
    modal: ModalComponent;
    typeAction: string = '';
    org: Org;
    relations: Array<number> = [];


    constructor(userService: UserService, http: Http) {
        this.user = userService.getCurrent();
        this.http = http;
        this.org = new Org();

        this.getOrgs();
    }
    getOrgs() {

        //this.orgs =[{"id":1,"title":"this is item111","description":"some value here"},{"id":2,"title":"this is item 22","description":"some value here 2"}];
        this.http.get('http://ang-grid/ang2/ang.php').map((res: Response) =>
            res.json()).subscribe(res => {
                var i: number = 0;
                for (var key in res) {
                    this.orgs[i] = res[key];
                    this.relations[i] = parseInt(key, 10);
                    i++;
                }
                console.log(this.relations);
            });

    }

    modalOpen() {

        this.modal.open();
    }

    edit(id) {

        if (id == 0) {
            this.typeAction = 'Добавление';
            this.org = new Org();
        } else {
            this.typeAction = 'Редактирование';
            var index: number = this.relations.indexOf(id);
            var org = this.orgs[index];
            var clone = new Org();
            for (var key in org) {
                clone[key] = org[key];
            }
            this.org = clone;

        }

        this.modal.open();
    }

    itemSave(id) {
        this.http.post('http://ang-grid/ang2/ang.php?action=save', JSON.stringify(this.org)).map((res: Response) =>
            res.json()).subscribe(res => {
                var i = this.getIndex(res['id']);
                if (i > -1) {
                    this.orgs[i] = res;
                } else {
                    this.orgs.push(res);
                }

            });
        this.modal.close();
    }

    getIndex(id) {
        for (var i = 0; i < this.orgs.length; i++) {
            var org = this.orgs[i];
            if (org.id == id) {
                return i;
            }
        }

        return -1;
    }

}

class Org {
    id: number;
    title: string;
    description: string;

    constructor() {
        this.id = 0;
    }
}

