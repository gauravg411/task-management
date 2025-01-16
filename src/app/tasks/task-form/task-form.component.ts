import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder, private taskService: TaskService, private router: Router) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['pending', Validators.required] // Default to pending
    });
  }

  ngOnInit(): void {
    // If editing an existing task, prepopulate the form
    if (this.taskData) {
      this.taskForm.patchValue(this.taskData);
    }
  }

  submitTask() {
    if (this.taskForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
    console.log(this.taskForm.value);
    // Send the task data to the backend through the service
    this.taskService.createTask(this.taskForm.value).subscribe(
      (response) => {
        console.log('Task created successfully:', response);
        alert('Task created successfully!');

        // Optionally reset the form after submission
        this.taskForm.reset({
          title: '',
          description: '',
          status: 'pending'
        });

        // Redirect to another page (e.g., tasks list) after successful task creation
        this.router.navigate(['/tasks']);
      },
      (error) => {
        console.error('Error creating task:', error);
        alert('Error creating task. Please try again later.');
      }
    );
  }
}
