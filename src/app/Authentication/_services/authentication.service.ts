﻿import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User, Student } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'))) 
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string, rememberMe: string) {
        return this.http.post<any>(`${environment.apiUrl}/accounts/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(rememberMe == "remember"){
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }else if(rememberMe == "notRemember"){
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}