import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      alert('Please fill in valid details.');
      return;
    }

    console.log(this.registerForm.value)
    this.authService.register(this.registerForm.value).subscribe(
      res => {
        this.router.navigateByUrl('/login');
        alert('Registration successful! You can now log in.');
      },
      err => alert('Error: ' + err.error.message)
    );
  }
}
