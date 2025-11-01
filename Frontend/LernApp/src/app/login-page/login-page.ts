import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { AccountCreateRequest, LoginRequest } from 'api';

// Avoid importing generated model types here to keep the component minimal and
// avoid any path-resolution issues in the quick scaffold. Use `any` for payload/response.

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  public loading = false;
  public error: string | null = null;
  public success: string | null = null;
  public isRegister = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.loading = true;
    this.error = null;
    this.success = null;

    if (this.isRegister) {
      const payload: AccountCreateRequest = {
        userName: form.value.username,
        mail: form.value.mail,
        password: form.value.password,
      };

      this.auth.register(payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Registration successful. You can now login.';
          this.isRegister = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.error = err && err.message ? err.message : 'Registration failed';
        },
      });
    } else {
      const payload: LoginRequest = {
        email: form.value.mail,
        password: form.value.password,
      };

      this.auth.login(payload).subscribe({
        next: () => {
          this.loading = false;
          // navigate to home after successful login
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.loading = false;
          this.error = err && err.message ? err.message : 'Login failed';
        },
      });
    }
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.error = null;
    this.success = null;
  }
}
