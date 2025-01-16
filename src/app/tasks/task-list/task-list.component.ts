import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  errorMessage: string | null = null; // For displaying error messages

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.errorMessage = null; // Clear previous error messages
    this.taskService.getTasks().subscribe(
      res => {
        this.tasks = res;
      },
      err => {
        console.error('Error loading tasks:', err);
        this.errorMessage = 'Failed to load tasks. Please try again later.';
      }
    );
  }

  deleteTask(taskId: string) {
    this.errorMessage = null; // Clear previous error messages
    this.taskService.deleteTask(taskId).subscribe(
      res => {
        this.loadTasks(); // Refresh the task list after deletion
      },
      err => {
        console.error('Error deleting task:', err);
        this.errorMessage = 'Failed to delete task. Please try again later.';
      }
    );
  }
}
