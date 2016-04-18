
import {Component, View} from 'angular2/angular2';
import {Http, Headers} from 'angular2/http';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';

@Component({
  selector: 'my-http'
})

@View({
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES ],  
  template: `
  <header>
    <h1 class="title">Angular 2 HTTP</h1>
  </header>

  <section>
    <h2>Login</h2>
    <form #f="form" (ng-submit)="authenticate(f.value)">
      <div ng-control-group="credentials">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            ng-control="username"
            required>

          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            ng-control="password"
            required>
      </div>

      <button>Login!</button>

    </form>

  </section>

  <section>
    <h2>Random Quote</h2>
    <hr>
    <h3></h3>
    <button (click)="getRandomQuote()">Get Random Quote!</button>
  <section>

  <section>
    <h2>Secret Quote</h2>
    <hr>
    <h3></h3>
    <button (click)="getSecretQuote()">Get Secret Quote!</button>
  <section>
  `
})

export class MyHttp {

  constructor(public http: Http) {

  }

}