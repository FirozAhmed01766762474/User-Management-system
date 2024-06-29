import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../Models/Task';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {

  @Input() currentTask: Task | null = null;

  @Output()
  closeDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();

  onCloseTaskDetails()
  {
    this.closeDetailView.emit(false);
  }

}
