import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  errorMessage: string | null = null; // For displaying error messages
  currentUser: any;

  constructor(private taskService: TaskService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
      const userId = this.currentUser.userId; // Get the userId from the current user object
      this.loadTasks(userId); // Pass the userId to the loadTasks method
    });
  }

  loadTasks(userId: any) {
    this.errorMessage = null; // Clear previous error messages
    this.taskService.getTasksByUserId(userId).subscribe(
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
    console.log(taskId)
    this.errorMessage = null; // Clear previous error messages
    this.taskService.deleteTask(taskId).subscribe(
      res => {
        alert("Deleted successfully")
        this.loadTasks(this.currentUser.userId); // Refresh the task list after deletion
      },
      err => {
        console.error('Error deleting task:', err);
        this.errorMessage = 'Failed to delete task. Please try again later.';
      }
    );
  }

  // Edit task functionality
  editTask(task: any) {
    // Navigate to the task edit page, passing the task ID to the route
    this.router.navigate(['/tasks/edit', task._id]);
  }
}
