import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Input() taskData: any; // To prepopulate the form for editing
  @Output() formSubmit = new EventEmitter<any>(); // Event to emit the form data

  taskForm: FormGroup;
  currentUser: any;
  isEditMode: boolean = false; // Flag to determine if we are editing an existing task
  taskId: any | null = null;

  constructor(private fb: FormBuilder, private taskService: TaskService, 
    private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['pending', Validators.required] // Default to pending
    });
  }

  ngOnInit(): void {
    
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);

      // this.taskService.getTasksByUserId(this.currentUser.userId).subscribe((tasks) => {
      //   this.taskData = tasks;
      //   console.log(this.taskData);

      //   // If editing an existing task, prepopulate the form
      //   if (this.taskData) {
      //     console.log('Ank')
      //     this.isEditMode = true; // Switch to edit mode
      //     this.taskForm.patchValue(this.taskData);
      //   }
      // });
    });

    // Capture the taskId from the route (for edit mode)
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id'); // Get the taskId from the URL

      if (this.taskId) {
        this.isEditMode = true; // Set to edit mode if there's a taskId
        this.loadTaskDetails(this.taskId); // Fetch task details
      }
    });

  }


   // Load task details if in edit mode
   loadTaskDetails(taskId: string) {
    this.taskService.getTaskById(taskId).subscribe(
      (task) => {
        this.taskData = task;
        this.taskForm.patchValue(task); // Populate the form with existing task details
      },
      (error) => {
        console.error('Error fetching task details:', error);
        alert('Failed to load task details.');
      }
    );
  }

  submitTask() {
    if (this.taskForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    // Add userId to the task data (associating the task with the current user)
    const taskData = {
      ...this.taskForm.value, // Task form values
      userId: this.currentUser ? this.currentUser.userId : null // Add current user's userId
    };

    console.log('Task Data:', taskData);

    // Check if it's an edit or create operation
    if (this.isEditMode) {
      this.updateTask(taskData); // Update task
    } else {
      this.createTask(taskData); // Create new task
    }
  }

  // Create a new task
  createTask(taskData: any) {
    this.taskService.createTask(taskData).subscribe(
      (response) => {
        console.log('Task created successfully:', response);
        alert('Task created successfully!');

        // Optionally reset the form after submission
        this.taskForm.reset({
          title: '',
          description: '',
          status: 'pending'
        });

        // Redirect to tasks list after successful task creation
        this.router.navigate(['/tasks']);
      },
      (error) => {
        console.error('Error creating task:', error);
        alert('Error creating task. Please try again later.');
      }
    );
  }

  // Update an existing task
  updateTask(taskData: any) {
    console.log(taskData)
    this.taskService.updateTask(this.taskId, taskData).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        alert('Task updated successfully!');

        // Redirect to tasks list after successful task update
        this.router.navigate(['/tasks']);
      },
      (error) => {
        console.error('Error updating task:', error);
        alert('Error updating task. Please try again later.');
      }
    );
  }
}
