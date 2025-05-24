import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentDev } from '../environment/environment.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  private readonly BASE_URI = '/api/access-control';

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ){}

  public getAllResources(): Observable<String[]> {
    return this.http.get<String[]>(this.env.apiUrl + this.BASE_URI + '/resources');
  }

  public getAllActions(): Observable<String[]> {
    return this.http.get<String[]>(this.env.apiUrl + this.BASE_URI + '/actions');
  }

}
