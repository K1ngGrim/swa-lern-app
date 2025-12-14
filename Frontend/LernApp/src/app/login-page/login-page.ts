import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { AccountCreateRequest, LoginRequest, LoginResponse, IdentityResponse } from 'api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, MatIconModule],
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
        next: (response: IdentityResponse) => {
          console.log('Register response:', response);
          if (response.success) {
            this.loading = false;
            this.success = 'Registration successful. You can now login.';
            this.isRegister = false;
          } else {
            this.loading = false;
            this.error = response.error || 'Registration failed';
          }
        },
        error: (err) => {
          console.log('Register error:', err);
          this.loading = false;
          this.error = err && err.message ? err.message : 'Registration failed';
        },
      });
    } else {
      const payload: LoginRequest = {
        email: form.value.email,
        password: form.value.password,
      };

      this.auth.login(payload).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login response:', response);
          if (response.success) {
            this.loading = false;
            this.router.navigate(['/home']);
          } else {
            this.loading = false;
            this.error = response.error || 'Login failed';
          }
        },
        error: (err) => {
          console.log('Login error:', err);
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
