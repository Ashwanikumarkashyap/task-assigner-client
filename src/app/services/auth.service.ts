import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

interface AuthResponse {
  status: string,
  success: string,
  token: string
};

interface JWTResponse {
  status: string,
  success: string,
  user: any
};

@Injectable()
export class AuthService {

  tokenKey: string = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService) { }


  logIn(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + 'users/login', 
      {"username": user.username, "password": user.password})
      .map(res => {
          this.storeUserCredentials({username: user.username, token: res.token});
          return {'success': true, 'username': user.username };
      })
        .catch(error => {
          console.log("error in registering: ", error);
          return this.processHTTPMsgService.handleError(error);
        });
  }

  signUp(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + 'users/signup', 
      user)
      .map(res => {
          return res;
      })
        .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  storeUserCredentials(credentials: any) {
    // console.log("storeUserCredentials: ", credentials);    
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  loadUserCredentials() {
    var credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    // console.log("loadUserCredentials ", credentials);
    if (credentials && credentials.username != undefined) {
      this.useCredentials(credentials);
      if (this.authToken)
        this.checkJWTtoken();
    } else {
      console.log("credentials are cleared");
      this.clearUsername();
    }
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.authToken = credentials.token;
    this.sendUsername(credentials.username);
  }

  sendUsername(name: string) {
    this.username.next(name);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + 'users/checkJWTtoken')
    .subscribe(res => {
      console.log("JWT Token Valid");
    },
    err => {
      console.log("JWT Token invalid: ", err);
      this.destroyUserCredentials();
    })
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  logOut() {
    this.destroyUserCredentials();
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getToken(): string {
    return this.authToken;
  }

  getUsers(): Observable<any> {
    return this.http.get(baseURL + 'users')
    .map(res => { return res })
    .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

}