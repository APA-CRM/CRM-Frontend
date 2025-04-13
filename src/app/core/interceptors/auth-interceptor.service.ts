import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStorageService } from '../services/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private authStorage: AuthStorageService,
    private router: Router 
  ) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = this.modifyRequestIfAuthorized(req);
    
    return next.handle(authReq).pipe(
      catchError((err) => {
        if(err.status == 401 && !this.isRefreshing){
          this.isRefreshing = true;

          this.authService.refreshToken().subscribe({
            next: (val) => {
              this.isRefreshing = false;
              this.authStorage.saveCredential(val);
              
              const authReq = this.modifyRequestIfAuthorized(req);

              return next.handle(authReq);
            },
            error: (err) => {
              this.router.navigate(['login'])
            }
          })
        }
        return throwError(() => err);
      })
    );
  }

  private modifyRequestIfAuthorized(req: HttpRequest<any>): HttpRequest<any> {
    const token: string | null = this.authStorage.getTokenWithType();
  
    if(token) {
      return req.clone({
        setHeaders: {Authorization: token}
      })
    }

    return req;
  }
}
