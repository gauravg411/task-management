import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    console.log(this.loginForm.value)
    if (this.loginForm.invalid) {
      alert('Please fill in valid credentials.');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      res => {
        // console.log(res)
        localStorage.setItem('token', res.token);
        alert('login successfully')
        this.router.navigate(['/tasks']);
        
      },
      err => alert('Invalid login credentials')
    );
  }
}
