import {Injectable} from 'angular2/core';

@Injectable() // скобки обязательны
export class Org {
    id: number;
    title: string;
    description: string;
    s: string;
    
    constructor(){
        this.id = 0;
        this.title = '';
        this.description = '';
    }

}