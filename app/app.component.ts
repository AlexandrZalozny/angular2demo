import {Component, ViewChild } from 'angular2/core';
import {NgClass} from 'angular2/common';
import {UserService} from './user.service';
import {Logger} from './logger';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {Http, Response, Headers, RequestOptions, URLSearchParams, ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
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
    orgs: any[];//Org[] = [];
    @ViewChild('myModal')
    modal: ModalComponent;
    typeAction: string = '';
    orgSelect: Org;
    orgEdit: Org;
    orgDetails: Org;
    relations: Array<number> = [];
    pageList: Array<number> = [1, 2, 3, 4, 5, 100];
    indexPageList: number = 0;
    currentPage: number = 1;
    pages: Array<number> = [1];
    maxPage: number = 1;
    allRowCount: number = 0;
    firstRowNumber: number = 0;
    lastRowNumber: number = 0;
    oldTitle: string = '';
    loading: boolean = true;

    constructor(userService: UserService, http: Http) {
        this.user = userService.getCurrent();
        this.http = http;
        this.orgSelect = new Org();
        this.orgEdit = new Org();
        this.orgDetails = new Org();

        this.getOrgs();
    }
    getOrgs() {

        let params: URLSearchParams = new URLSearchParams();
        params.set('page', this.currentPage);
        params.set('count_rec', this.pageList[this.indexPageList]);

        this.loading = true;

        this.http.get('http://ang-grid/ang2/ang.php', { 'search': params }).map((res: Response) =>
            res.json()).subscribe(
            res => {
                this.orgs = res.rows;
                this.allRowCount = res.total;
                this.firstRowNumber = (this.currentPage - 1) * this.pageList[this.indexPageList] + 1;
                this.lastRowNumber = this.currentPage * this.pageList[this.indexPageList];
                if (this.firstRowNumber > this.allRowCount) {
                    this.firstRowNumber = this.allRowCount;
                }
                if (this.lastRowNumber > this.allRowCount) {
                    this.lastRowNumber = this.allRowCount;
                }

                let pages: number = Math.ceil(res.total / this.pageList[this.indexPageList]);
                if (pages < 1) {
                    pages = 1;
                }
                this.maxPage = pages;
                let aPages: Array<number> = [];
                if (pages <= 5) {
                    for (let i = 1; i <= pages; i++) {
                        aPages.push(i);
                    }
                } else {
                    let i = this.currentPage;
                    aPages.push(i);
                    let j = 1;
                    while (aPages.length < 5) {
                        if (i - j > 0) {
                            aPages.push(i - j);
                        }
                        if (i + j <= this.maxPage && aPages.length < 5) {
                            aPages.push(i + j);
                        }
                        j++;

                    }
                    aPages.sort((n1, n2) => n1 - n2);
                }

                this.pages = aPages;
                this.loading = false;

            }
            );

    }

    modalOpen() {

        this.modal.open();
    }

    edit(index) {
        if (index == -1) {
            this.typeAction = 'Добавление';
            this.orgSelect = new Org();
        } else {
            this.typeAction = 'Редактирование';
            this.orgEdit = Object.assign({}, this.orgs[index]);

        }

        this.modal.open();
    }

    itemSave(id) {
        this.loading = true;
        console.log(this.orgSelect['title']);
        this.http.post('http://ang-grid/ang2/ang.php?action=save', JSON.stringify(this.orgSelect)).map((res: Response) =>
            res.json()).subscribe(res => {
                if (id == 0) {
                    this.getOrgs();
                } else {

                    this.orgDetails = Object.assign({}, res);
                    this.orgSelect = Object.assign({}, res);

                }
            });
        this.modal.close();
        this.loading = false;
    }

    formSave(id) {
        this.loading = true;
        this.http.post('http://ang-grid/ang2/ang.php?action=save', JSON.stringify(this.orgEdit)).map((res: Response) =>
            res.json()).subscribe(res => {
                if (id == 0) {
                    this.getOrgs();
                } else {
                    let index = this.getIndex(res['id']);
                    this.orgs[index] = Object.assign({}, res);;
                    this.orgSelect = Object.assign({}, res);
                    this.orgDetails = Object.assign({}, res);;

                }
            });
        this.modal.close();
        this.loading = false;
    }

    getIndex(id) {
        for (var i = 0; i < this.orgs.length; i++) {
            let org = this.orgs[i];
            if (org.id == id) {
                return i;
            }
        }

        return -1;
    }

    selectOrg(id) {
        if (this.loading == false) {
            let index = this.getIndex(id);
            this.orgSelect = this.orgs[index];
            this.orgDetails = Object.assign({}, this.orgSelect);;
        }
    }

    changePageList(index) {
        if (index != this.indexPageList) {
            this.indexPageList = index;
            this.currentPage = 1;
            this.getOrgs();
        }
    }

    setPageClasses(i) {
        return { 'active': this.currentPage == i };
    }
    changePage(page) {
        if (this.currentPage !== page && page !== 0 && page <= this.maxPage) {
            this.currentPage = page;
            this.getOrgs();
        }
    }
    onKeyPressTitle(event, id) {
        if (event.keyCode == 13) {
            this.itemSave(id);
            this.oldTitle = this.orgSelect.title;
        } else if (event.keyCode == 27) {
            this.orgSelect.title = this.oldTitle;
        }

    }
    onBlurTitle(event, id) {
        let newValue = event.target.value;
        if (newValue != this.oldTitle) {
            this.itemSave(id);
        }
    }

    onFocusTitle(event, id) {
        this.oldTitle = event.target.value;

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

