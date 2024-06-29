import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../Models/Task';
import {  HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subscription, map } from 'rxjs';
import { TaskService } from '../Services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
 
  showCreateTaskForm: boolean = false;
  showTaskDetails:boolean = false;
  http :HttpClient = inject(HttpClient);
  allTask:Task[]=[];
  selectedTask:Task;
  currentID:string;
  isloding:boolean=false;

  taskService :TaskService = inject(TaskService);

  editMode:boolean = false;

  errorMessage: string| null = null;
  currentTask: Task | null = null;

  errsub: Subscription
  ngOnInit()
  {
   this.fatchAllTask();
   this.errsub = this.taskService.errSubject.subscribe({next: (httpError)=>{
     this.setErrorMessage(httpError);
   }});
  }

  ngOnDestroy(){
    this.errsub.unsubscribe();
  }

  showCurrentTaskDetails(id:string|undefined)
  {
       this.showTaskDetails = true;
       console.log(id);
       this.taskService.getTaskDetails(id).subscribe({next: (data: Task) => {
        this.currentTask = data;
        //console.log(this.currentTask);
      }});

      
  }
  removeTaskDetails()
  {
    this.showTaskDetails = false;
  }

  OpenCreateTaskForm(){
    this.showCreateTaskForm = true;
    this.editMode =false;
    this.selectedTask = {title:'', desc:'', assignTo:'', createdAt:'', priority:'',status:''}
  }

  CloseCreateTaskForm(){
    this.showCreateTaskForm = false;
  }
  createOrUpdateTask( data:Task)
  {
    if(!this.editMode)
        this.taskService.CreateTask(data);
    else
       this.taskService.UpdateTask(this.currentID, data);
    //
    this.showCreateTaskForm = false;
    this.fatchAllTask();
  }
  uploadFatchAllTask()
  {
    this.fatchAllTask();
  }



  private fatchAllTask(){
    this.isloding = true;
    this.taskService.GetAllTask().subscribe({next: (tasks) => {
      this.allTask = tasks;
      this.isloding = false;
    }, error: (error) => {
      this.setErrorMessage(error);
      this.isloding = false;
    }})
  }

  private setErrorMessage(err: HttpErrorResponse){
    if(err.error.error === 'Permission denied'){
      this.errorMessage = 'You do not have permisssion to perform this action';
    }
    else{
      this.errorMessage = err.message;
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
  deleteTask(id:string | undefined)
  {
    this.taskService.DeleteTask(id);
    this.fatchAllTask();

  }
  deleteAllTask()
  {
    this.taskService.DeletrAllTask();
    this.fatchAllTask();
  }

  onEdidTask(id: string | undefined)
  {
       this.currentID = id;
       this.showCreateTaskForm = true;
       this.editMode = true;

       this.selectedTask = this.allTask.find((task)=>{
            return task.id ==id;
       });
      this.uploadFatchAllTask();
  }
}
