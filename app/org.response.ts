import {Injectable} from 'angular2/core';
import { Org } from './org';

@Injectable() // скобки обязательны
export class OrgResponse{
    rows:Org[] = [];
    total: number;

}