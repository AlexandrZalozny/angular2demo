import {Injectable} from 'angular2/core';
import {Logger} from './logger';

@Injectable() // скобки обязательны
export class UserService {
    constructor(private _logger: Logger) {}
    getCurrent() {
        this._logger.log('Получение пользователя...');
        return { username: 'Admin', email: 'admin@example.com' };
    }
}