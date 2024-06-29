import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Task } from "../Models/Task";
import { Subject, catchError, exhaustMap, map, take, tap, throwError } from "rxjs";
import { Loggingservices } from "./logging.services";
import { AuthService } from "./auth.service";


@Injectable({
    providedIn:'root'
})
export class TaskService{
    http :HttpClient = inject(HttpClient);
    loggingService :Loggingservices = inject(Loggingservices);
    errSubject = new Subject<HttpErrorResponse>();
    authSurvice:AuthService = inject(AuthService);


    GetAllTask()
    {
       return  this.authSurvice.http.get('https://angularhttpclient-99297-default-rtdb.firebaseio.com/tasks.json').pipe( map((response)=>{
            let tasks = [];
            console.log(response);
            for(let key in response)
              {
                if(response.hasOwnProperty(key))
                  {
                    tasks.push({...response[key], id:key});
                  }
              }
              return tasks;
      
          }), catchError((err)=>{
              const errorObj = {statusCode:err.status, errorMessage:err.message, datetime: new Date()}
              this.loggingService.logError(errorObj)
              return throwError(()=>err);
          }))
       
    //    return this.http.get<{[key:string]:Task}>
    //     ('https://angularhttpclient-99297-default-rtdb.firebaseio.com/tasks/.json'
    //     )
    //     .pipe(map((response)=>{
    //       let tasks = [];
    //       console.log(response);
    //       for(let key in response)
    //         {
    //           if(response.hasOwnProperty(key))
    //             {
    //               tasks.push({...response[key], id:key});
    //             }
    //         }
    //         return tasks;
    
    //     }), catchError((err)=>{
    //         const errorObj = {statusCode:err.status, errorMessage:err.message, datetime: new Date()}
    //         this.loggingService.logError(errorObj)
    //         return throwError(()=>err);
    //     }))

    }



    CreateTask(task:Task)
    {
        const headers = new HttpHeaders({'myHeader': 'hellow Firoz'}); 
        this.http.post<{name:string}>(
            'https://angularhttpclient-99297-default-rtdb.firebaseio.com/tasks.json',task,
            {headers: headers})
        .pipe(catchError((err)=>{
            const errorObj = {statusCode:err.status, errorMessage:err.message, datetime: new Date()}
            this.loggingService.logError(errorObj)
            return throwError(()=>err);
        }))
        .subscribe({error: (err)=>{
             this.errSubject.next(err);
        }});
    }

    DeleteTask(id: string|undefined)
    {
        this.http.delete('https://angularhttpclient-99297-default-rtdb.firebaseio.com/tasks/' + id +'.json', {observe: 'events', responseType: 'json'})
                        .pipe(tap((event) => {
                            console.log(event);
                            if(event.type === HttpEventType.Sent){

                            }

                        }),catchError((err)=>{
                            const errorObj = {statusCode:err.status, errorMessage:err.message, datetime: new Date()}
                            this.loggingService.logError(errorObj)
                            return throwError(()=>err);
                        }))
                        .subscribe( {error: (err)=>{
                            this.errSubject.next(err);
                       }})

    }

    DeletrAllTask()
    {
        this.http.delete('https://angularhttpclient-99297-default-rtdb.firebaseio.com/tasks.json')
        .pipe(catchError((err)=>{
            const errorObj = {statusCode:err.status, errorMessage:err.message, datetime: new Date()}
            this.loggingService.logError(errorObj)
            return throwError(()=>err);
        }))
        .subscribe( {error: (err)=>{
            this.errSubject.next(err);
       }})
    }

    UpdateTask(id:string | undefined, data: Task)
    {
        this.http.put('https://angularhttpclient-99297-default-rtdb.firebaseio.com/tasks/'+id +'.json',data)
        .pipe(catchError((err)=>{
            const errorObj = {statusCode:err.status, errorMessage:err.message, datetime: new Date()}
            this.loggingService.logError(errorObj)
            return throwError(()=>err);
        }))
        .subscribe({error: (err)=>{
            this.errSubject.next(err);
       }});
    }

    getTaskDetails(id:string|null)
    {
       return  this.http.get('https://angularhttpclient-99297-default-rtdb.firebaseio.com/tasks/'+id+'.json')
        .pipe(map((response)=>{
           console.log(response);
           let task = {};
           task = {...response, id:id}
           return task;
        }))

    }


}