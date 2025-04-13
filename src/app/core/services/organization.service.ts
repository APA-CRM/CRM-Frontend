import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentDev } from '../environment/environment.dev';
import { Observable } from 'rxjs';
import { OrganizationModel } from '../models/organization-model';
import { OrganizationCreate } from '../models/organization-create';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ){}

  public createOrganization(body: OrganizationCreate): Observable<OrganizationModel> {
    return this.http.post<OrganizationModel>(this.env.apiUrl + this.BASE_URI, body);
  }
}
