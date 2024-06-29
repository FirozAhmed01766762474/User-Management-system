import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, exhaustMap, take, tap } from "rxjs";
import { AuthService } from "./auth.service";


export class AuthInterceptorService implements HttpInterceptor
{
    authService:AuthService = inject(AuthService)
     intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.authService.user.pipe(take(1),exhaustMap((user)=>{
            if(!user){
                return next.handle(req);
            }
           const modifiedRequist = req.clone({
            params: new HttpParams().set('auth',user.token

            )})
            return next.handle(modifiedRequist)
         }));
         
     }
}