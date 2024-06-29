import { HttpClient } from '@angular/common/http'
import{Injectable,inject} from'@angular/core'

@Injectable({
    providedIn:'root'
})
export class Loggingservices{

    http :HttpClient = inject(HttpClient);
   logError(data: {statusCode:number, errorMessage:string, datetime:Date}){
       this.http.post('https://angularhttpclient-99297-default-rtdb.firebaseio.com/log.json',data)
       .subscribe();
   }
   fatchError(){
       this.http.get('https://angularhttpclient-99297-default-rtdb.firebaseio.com/log.json')
       .subscribe((data)=>{
         console.log(data);
       })
   }
}