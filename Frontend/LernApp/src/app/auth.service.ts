import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IdentityService } from '../../projects/api/src/lib/api/identity.service';
import {
  AccountCreateRequest,
  IdentityResponse,
  LoginRequest,
  LoginResponse,
} from '../../projects/api/src/lib/model/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSignal = signal<LoginResponse | null>(null);
  public currentUser$ = toObservable(this.currentUserSignal);

  private identityService: IdentityService;

  constructor(identityService: IdentityService) {
    this.identityService = identityService;
    this.restoreFromStorage();
  }

  // Persist key for localStorage
  private readonly STORAGE_KEY = 'lernapp_currentUser';

  // restore persisted user if present
  private restoreFromStorage() {
    try {
      const raw =
        typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem(this.STORAGE_KEY)
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as LoginResponse;
        this.currentUserSignal.set(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }

  // Save current user to storage
  private persist(user: LoginResponse | null) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (user) {
          window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        } else {
          window.localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    } catch {
      // ignore storage errors
    }
  }

  /**
   * Register a new account using the generated API.
   * Returns the raw IdentityResponse observable from the API.
   */
  register(accountCreateRequest: AccountCreateRequest): Observable<IdentityResponse> {
    return this.identityService.apiIdentityRegisterPost({ accountCreateRequest });
  }

  /**
   * Login using the generated API. On success the LoginResponse is emitted to currentUser$.
   */
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.identityService.apiIdentityLoginPost({ loginRequest }).pipe(
      tap((res: LoginResponse) => {
        if (res.success) {
          this.currentUserSignal.set(res);
          this.persist(res);
        }
      })
    );
  }

  /**
   * Clear locally-stored auth state.
   */
  logout(): void {
    this.currentUserSignal.set(null);
    this.persist(null);
  }

  /**
   * Return immediately-available current user value.
   */
  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSignal();
  }
}
