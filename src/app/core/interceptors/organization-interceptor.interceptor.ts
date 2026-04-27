import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OrganizationHolderService} from '../services/organizations/organization-holder.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationInterceptor implements HttpInterceptor {

  constructor(
    private organizationHolder: OrganizationHolderService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let organizationId: number = this.organizationHolder.getOrganizationId();

    if (!organizationId) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: {
          'Organization-Id': organizationId.toString()
        }
      })
    )
  }

}
