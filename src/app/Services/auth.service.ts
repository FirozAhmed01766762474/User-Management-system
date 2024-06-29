import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthResponse } from "../Models/AuthResponse";
import { BehaviorSubject, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "../Models/User";
import { Router } from "@angular/router";
@Injectable({
    providedIn: 'root'
})
export class AuthService{
    http:HttpClient = inject(HttpClient);
    user = new BehaviorSubject<User>(null);
    router:Router = inject(Router);

    signUp(email,password)
    {
        const data = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        return this.http.post<AuthResponse>
                    (
                        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBONaaHvH09XspWc3-M861VUxPnWEEslc8',
                        data
                    ).pipe(
                        catchError(this.handleError),
                        tap((res)=>{
                           this.handleCreateUser(res);
                           
                        }));

    }

    login(email, password){
        const data = {email: email, password: password, returnSecureToken: true};
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBONaaHvH09XspWc3-M861VUxPnWEEslc8',
            data
        ).pipe(catchError(this.handleError),tap((res)=>{
              this.handleCreateUser(res);
        }))
    }
    logOut()
    {
        this.user.next(null);
        this.router.navigate(['/login'])
    }

    private handleCreateUser(res)
    {
        const expereinTs = new Date().getTime()+ +res.expiresIn*1000;
        const expireIn = new Date(expereinTs);
        const user = new User(res.email,res.localId,res.idToken, expireIn);
        this.user.next(user); 
    }

    private handleError(err){
        let errorMessage = 'An unknown error has occured'
        console.log(err);
        if(!err.error || !err.error.error){
            return throwError(() => errorMessage);
        }
        switch (err.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage ="This email already exists.";
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'This operation is not allowed.';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'The email ID or Password is not correct.';
                break;
        }
        return throwError(() => errorMessage);
    }

}