import {Component, ViewChild } from 'angular2/core';
import {NgClass} from 'angular2/common';
import {UserService} from './user.service';
import {OrgService} from './org.service';
import {Org} from './org';
import {Logger} from './logger';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {Http, Response, Headers, RequestOptions, URLSearchParams, ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';



@Component(
    {
        selector: 'app',
        providers: [OrgService, UserService, Logger, Http, ConnectionBackend, HTTP_PROVIDERS, ModalComponent],
        templateUrl: './app/app.html',
        directives: [MODAL_DIRECTIVES]
    }
)
export class AppComponent {


    greetings: string = 'World';
    user: any;
    http: Http;
    orgs: Org[] = [];//Org[] = [];
    @ViewChild('myModal')
    modal: ModalComponent;
    typeAction: string = '';
    orgSelect: Org;
    orgEdit: Org;
    orgDetails: Org;
    relations: Array<number> = [];
    pageList: Array<number> = [5, 15, 25, 50, 100];
    indexPageList: number = 0;
    currentPage: number = 1;
    pages: Array<number> = [1];
    maxPage: number = 1;
    allRowCount: number = 0;
    firstRowNumber: number = 0;
    lastRowNumber: number = 0;
    oldTitle: string = '';
    loading: boolean = true;
    url: string = 'http://ang-grid/ang2/ang.php';
    errorMessage: string;
    sortable: string;
    sortableType: string;

    constructor(private orgService: OrgService, private userService: UserService) {

    }

    ngOnInit() {
        this.user = this.userService.getCurrent();
        //this.http = http;
        this.orgSelect = this.orgService.getEmpty();
        this.orgEdit = this.orgService.getEmpty();
        this.orgDetails = this.orgService.getEmpty();

        this.getListOrgs();
    }
    getListOrgs() {
        this.loading = true;
        this.orgService.getPage(this.currentPage, this.pageList[this.indexPageList], this.sortable, this.sortableType)
            .subscribe(
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

            },
            error => this.errorMessage = <any>error,
            () => { this.loading = false; }
            );

        // this.loading = false;


    }
    /*
        getOrg(id): Observable<Org> {
            let params: URLSearchParams = new URLSearchParams();
            params.set('id', id);
            return this.http.get(this.url + '?action=getOne', { 'search': params }).map(
                (res: Response) => res.json()
            );
        }
    */
    modalOpen() {
        this.modal.open();
    }

    edit(id: number) {
        this.orgEdit = new Org();
        if (id == -1) {
            this.typeAction = 'Добавление';
            this.modal.open();
        } else {
            this.typeAction = 'Редактирование';
            this.loading = true;
            this.orgService.get(id).subscribe(
                org => {
                    this.orgEdit = org;
                    this.modal.open();
                },
                error => this.errorMessage = <any>error,
                () => { this.loading = false; }
            );
        }
    }

    remove(id: number) {
        this.loading = true;
        this.orgService.remove(id).subscribe(
            org => {
            },
            error => {
                this.errorMessage = <any>error;
                this.getListOrgs();
            },
            () => {
                this.getListOrgs();
                this.loading = false;
            }
        );
    }

    itemSave(id: number) {
        let index = this.getIndex(id);
        this.loading = true;
        this.orgService.save(this.orgs[index])
            .subscribe(
            org => {
                this.orgs[index] = org;
                this.orgDetails = Object.assign({}, org);
                this.orgSelect = Object.assign({}, org);
            },
            error => this.errorMessage = <any>error,
            () => { this.loading = false; }
            );

    }

    formSave(orgEdit: Org) {
        this.loading = true;
        this.orgService.save(orgEdit)
            .subscribe(
            org => {
                this.orgDetails = Object.assign({}, org);
                this.orgSelect = Object.assign({}, org);

                if (orgEdit.id == 0) {
                    this.getListOrgs();
                } else {
                    let index = this.getIndex(org.id);
                    this.orgs[index] = org;
                }

            },
            error => this.errorMessage = <any>error,
            () => {
                this.modal.close();
                this.loading = false;
            }
            );
    }

    getIndex(id: number): number {
        for (var i = 0; i < this.orgs.length; i++) {
            let org = this.orgs[i];
            if (org.id == id) {
                return i;
            }
        }

        return -1;
    }

    onClickRow(id) {
        if (this.loading == false) {
            let index = this.getIndex(id);
            let org = this.orgs[index];

            if (org.id !== this.orgSelect.id) {
                this.orgSelect = org;
                this.loading = true;
                this.orgService.get(id).subscribe(
                    org => {
                        this.orgDetails = org;
                    }
                    ,
                    error => this.errorMessage = <any>error,
                    () => {
                        this.loading = false;
                    }

                );
            }
        }
    }

    changePageList(index) {
        if (index != this.indexPageList) {
            this.indexPageList = index;
            this.currentPage = 1;
            this.getListOrgs();
        }
    }

    setPageClasses(i) {
        return { 'active': this.currentPage == i };
    }

    changePage(page) {
        if (this.currentPage !== page && page !== 0 && page <= this.maxPage && this.loading == false) {
            this.currentPage = page;
            this.getListOrgs();
        }
    }
    onKeyPressTitle(event: Event, id: number) {

        /* if (event.keyCode == 13) {
             this.itemSave(id);
             this.oldTitle = this.orgSelect.title;
         } else if (event.keyCode == 27) {
             
             this.orgSelect.title = this.oldTitle;
         }*/

    }

    onBlurTitle(event: Event, id: number) {
        let newValue: string = event.target.value;
        if (newValue != this.oldTitle) {
            this.itemSave(id);
        }
    }

    onFocusTitle(event: Event, id: number) {
        this.oldTitle = event.target.value;

    }

    onClickTH(column: string) {
        if (this.sortable == column) {
            this.sortableType = (this.sortableType == 'asc') ? 'desc' : 'asc';
        } else {
            this.sortable = column;
            this.sortableType = 'asc';
        }
        this.currentPage = 1;
        this.getListOrgs();
    }
}