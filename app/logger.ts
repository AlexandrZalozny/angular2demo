import {Injectable} from 'angular2/core';



@Injectable() // скобки обязательны
export class Logger {
    logs: string[] = [];

    log(message: string) {
        this.logs.push(message);
        console.log(message);
    }
}