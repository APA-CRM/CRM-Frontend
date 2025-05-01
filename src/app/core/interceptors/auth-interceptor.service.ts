import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStorageService } from '../services/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  private isRefreshing = false;

  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private authStorage: AuthStorageService,
    private router: Router 
  ) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    
    request = this.addTokenHeader(req);
    

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status == 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => err);
      }))
  }

  private addTokenHeader(request: HttpRequest<any>) {
    let token = this.authStorage.getTokenWithType();

    if (token)
      return request.clone({
        setHeaders: {
          Authorization: token
        }
      });
    else
      return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(false);

      return this.authService.refreshToken().pipe(
        switchMap((tokenResp) => {
            this.isRefreshing = false;
            this.authStorage.saveCredential(tokenResp);


            this.refreshTokenSubject.next(true);
            return next.handle(this.addTokenHeader(request));
        }),
        catchError((err) => {
            this.isRefreshing = false;
            this.router.navigate(['login']);
            return throwError(() => err); 
        })
    );
    }
    else {
      return this.refreshTokenSubject.pipe(
        filter((bool: boolean) => bool),
        take(1),
        switchMap(() => next.handle(this.addTokenHeader(request)))
      );
    }
  }

}
